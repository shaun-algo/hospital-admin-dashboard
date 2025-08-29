<?php
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

include_once __DIR__ . '/../connection.php';

class AdmissionAPI {
    private $conn;

    public function __construct() {
        $this->conn = (new Database())->connect();
    }

    private function respond($data, $status = 200) {
        http_response_code($status);
        echo json_encode($data);
        exit;
    }

    private function checkExists($table, $column, $value) {
        $stmt = $this->conn->prepare("SELECT 1 FROM {$table} WHERE {$column} = :value LIMIT 1");
        $stmt->execute([':value' => $value]);
        return $stmt->fetchColumn() !== false;
    }

    public function getAllAdmissions() {
        try {
            $stmt = $this->conn->query("
                SELECT a.admissionid, a.patientid, a.doctorid, a.userid, a.admission_date, a.status,
                       p.fullname AS patient_name,
                       d.fullname AS doctor_name,
                       u.username AS user_name
                FROM Admission a
                LEFT JOIN Patient p ON a.patientid = p.patientid
                LEFT JOIN Doctor d ON a.doctorid = d.doctorid
                LEFT JOIN User u ON a.userid = u.userid
                ORDER BY a.admissionid DESC
            ");
            $results = $stmt->fetchAll(PDO::FETCH_ASSOC);
            $this->respond($results);
        } catch (Exception $e) {
            $this->respond(["error" => $e->getMessage()], 500);
        }
    }

    public function insertAdmission($data) {
        try {
            if (empty($data['patientid']) || empty($data['doctorid']) || empty($data['userid']) || empty($data['admission_date']) || empty($data['status'])) {
                $this->respond(["success" => false, "error" => "Missing required fields"], 422);
            }

            if (!$this->checkExists('Patient', 'patientid', $data['patientid'])) {
                $this->respond(["success" => false, "error" => "Invalid patient ID"], 422);
            }
            if (!$this->checkExists('Doctor', 'doctorid', $data['doctorid'])) {
                $this->respond(["success" => false, "error" => "Invalid doctor ID"], 422);
            }
            if (!$this->checkExists('User', 'userid', $data['userid'])) {
                $this->respond(["success" => false, "error" => "Invalid user ID"], 422);
            }

            // Prevent duplicate admission for currently admitted patient
            $checkStmt = $this->conn->prepare("
                SELECT 1 FROM Admission
                WHERE patientid = :patientid AND status NOT IN ('Discharged', 'Closed')
                LIMIT 1
            ");
            $checkStmt->execute([':patientid' => $data['patientid']]);
            if ($checkStmt->fetchColumn()) {
                $this->respond(["success" => false, "error" => "Patient is already admitted"], 422);
            }

            $stmt = $this->conn->prepare("
                INSERT INTO Admission (patientid, doctorid, userid, admission_date, status)
                VALUES (:patientid, :doctorid, :userid, :admission_date, :status)
            ");
            $stmt->execute([
                ':patientid' => $data['patientid'],
                ':doctorid' => $data['doctorid'],
                ':userid' => $data['userid'],
                ':admission_date' => $data['admission_date'],
                ':status' => $data['status']
            ]);

            $this->respond(["success" => true, "admissionid" => $this->conn->lastInsertId()], 201);
        } catch (Exception $e) {
            $this->respond(["success" => false, "error" => $e->getMessage()], 500);
        }
    }

    public function updateAdmission($data) {
        try {
            if (empty($data['admissionid']) || empty($data['patientid']) || empty($data['doctorid']) || empty($data['userid']) || empty($data['admission_date']) || empty($data['status'])) {
                $this->respond(["success" => false, "error" => "Missing required fields"], 422);
            }

            if (!$this->checkExists('Patient', 'patientid', $data['patientid'])) {
                $this->respond(["success" => false, "error" => "Invalid patient ID"], 422);
            }
            if (!$this->checkExists('Doctor', 'doctorid', $data['doctorid'])) {
                $this->respond(["success" => false, "error" => "Invalid doctor ID"], 422);
            }
            if (!$this->checkExists('User', 'userid', $data['userid'])) {
                $this->respond(["success" => false, "error" => "Invalid user ID"], 422);
            }

            $stmt = $this->conn->prepare("
                UPDATE Admission
                SET patientid = :patientid, doctorid = :doctorid, userid = :userid,
                    admission_date = :admission_date, status = :status
                WHERE admissionid = :admissionid
            ");
            $stmt->execute([
                ':admissionid' => $data['admissionid'],
                ':patientid' => $data['patientid'],
                ':doctorid' => $data['doctorid'],
                ':userid' => $data['userid'],
                ':admission_date' => $data['admission_date'],
                ':status' => $data['status']
            ]);

            if ($stmt->rowCount() === 0) {
                $this->respond(["success" => false, "error" => "Admission not found"], 404);
            }

            $this->respond(["success" => true]);
        } catch (Exception $e) {
            $this->respond(["success" => false, "error" => $e->getMessage()], 500);
        }
    }

    public function deleteAdmission($admissionid) {
        try {
            $stmt = $this->conn->prepare("DELETE FROM Admission WHERE admissionid = :id");
            $stmt->execute([':id' => $admissionid]);

            if ($stmt->rowCount() === 0) {
                $this->respond(["success" => false, "error" => "Admission not found"], 404);
            }

            $this->respond(["success" => true, "message" => "Admission deleted"]);
        } catch (Exception $e) {
            $this->respond(["success" => false, "error" => $e->getMessage()], 500);
        }
    }
}

$api = new AdmissionAPI();
$input = json_decode(file_get_contents("php://input"), true) ?? [];
$params = array_merge($_GET, $_POST, $input);

$operation = $params['operation'] ?? null;

switch ($operation) {
    case 'getAllAdmissions':
        $api->getAllAdmissions();
        break;
    case 'insertAdmission':
        $api->insertAdmission($input);
        break;
    case 'updateAdmission':
        $api->updateAdmission($input);
        break;
    case 'deleteAdmission':
        $api->deleteAdmission($params['admissionid'] ?? null);
        break;
    default:
        http_response_code(400);
        echo json_encode(["error" => "Invalid operation"]);
}
