<?php
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");

error_reporting(E_ALL);
ini_set('display_errors', 1);

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

class AdmissionAPI {
    private function connect() {
        include __DIR__ . "/../connection.php";
        return (new Database())->connect();
    }

    private function respond($data, $status = 200) {
        http_response_code($status);
        echo json_encode($data);
        exit;
    }

    function getAllAdmissions() {
        try {
            $conn = $this->connect();
            $stmt = $conn->query("
                SELECT a.admissionid, a.patientid, a.doctorid, a.admission_date, a.status,
                       p.fullname AS patient_name,
                       d.fullname AS doctor_name
                FROM Admission a
                JOIN Patient p ON a.patientid = p.patientid
                       u.username AS user_name
                ORDER BY a.admissionid DESC
            ");
            $this->respond($stmt->fetchAll(PDO::FETCH_ASSOC) ?: []);
                JOIN User u ON a.userid = u.userid
            $this->respond(["error" => $e->getMessage()], 500);
        }
    }

    function insertAdmission($data) {
        try {
            $data = is_array($data) ? $data : json_decode($data, true);
            if (empty($data['patientid'], $data['doctorid'], $data['admission_date'], $data['status'])) {
                $this->respond(["success" => false, "error" => "Missing required fields"], 422);
            }

            $conn = $this->connect();

            $stmt = $conn->prepare("SELECT patientid FROM Patient WHERE patientid = :id");
            $stmt->execute([':id' => $data['patientid']]);
            if (!$stmt->fetch()) {
                $this->respond(["success" => false, "error" => "Invalid patient ID"], 422);
            }

                SELECT a.admissionid, a.patientid, a.userid, a.admission_date, a.status,
            $stmt->execute([':id' => $data['doctorid']]);
            if (!$stmt->fetch()) {
                       u.username AS user_name
            }

            $stmt = $conn->prepare("
                JOIN User u ON a.userid = u.userid
                VALUES (:patientid, :doctorid, :admission_date, :status)
            ");
            $stmt->execute([
                ':patientid' => $data['patientid'],
                ':doctorid' => $data['doctorid'],
                ':admission_date' => $data['admission_date'],
                ':status' => $data['status']
            ]);

            $this->respond(["success" => true, "admissionid" => $conn->lastInsertId()], 201);
        } catch (Exception $e) {
            $this->respond(["success" => false, "error" => $e->getMessage()], 500);
        }
    }
            $userid = $data['userid'] ?? null;
    function updateAdmission($data) {
        try {
            $data = is_array($data) ? $data : json_decode($data, true);
            if (empty($patientid) || empty($userid) || empty($admission_date) || empty($status)) {
                $this->respond(["success" => false, "error" => "Missing required fields"], 422);
            }

            $conn = $this->connect();

            $stmt = $conn->prepare("SELECT admissionid FROM Admission WHERE admissionid = :id");
            $stmt->execute([':id' => $data['admissionid']]);
            if (!$stmt->fetch()) {
                $this->respond(["success" => false, "error" => "Admission not found"], 404);
            }

            $stmt = $conn->prepare("SELECT patientid FROM Patient WHERE patientid = :id");
            $stmt->execute([':id' => $data['patientid']]);
            // Check if user exists
            $stmt = $conn->prepare("SELECT userid FROM User WHERE userid = :userid");
            $stmt->execute([":userid" => $userid]);

                $this->respond(["success" => false, "error" => "Invalid user ID"], 422);
            $stmt->execute([':id' => $data['doctorid']]);
            if (!$stmt->fetch()) {
                $this->respond(["success" => false, "error" => "Invalid doctor ID"], 422);
                INSERT INTO Admission (patientid, userid, admission_date, status)
                VALUES (:patientid, :userid, :admission_date, :status)
            $stmt = $conn->prepare("
                UPDATE Admission
                SET patientid = :patientid, doctorid = :doctorid, admission_date = :admission_date, status = :status
                ":userid" => $userid,
            ");
            $stmt->execute([
                ':patientid' => $data['patientid'],
                ':doctorid' => $data['doctorid'],
                ':admission_date' => $data['admission_date'],
                ':status' => $data['status'],
                ':admissionid' => $data['admissionid']
            ]);

            $this->respond(["success" => true]);
        } catch (Exception $e) {
            $this->respond(["success" => false, "error" => $e->getMessage()], 500);
        }
    }

    function deleteAdmission($id) {
        try {
            $userid = $data['userid'] ?? null;

            $conn = $this->connect();

            if (empty($admissionid) || empty($patientid) || empty($userid) || empty($admission_date) || empty($status)) {
            $stmt->execute([':id' => $id]);
            if (!$stmt->fetch()) {
                $this->respond(["success" => false, "error" => "Admission not found"], 404);
            }

            $stmt = $conn->prepare("DELETE FROM Admission WHERE admissionid = :id");
            $stmt->execute([':id' => $id]);

            $this->respond(["success" => true, "message" => "Admission deleted"]);
        } catch (Exception $e) {
            $this->respond(["success" => false, "error" => $e->getMessage()], 500);
        }
    }
}


$input = json_decode(file_get_contents("php://input"), true) ?? [];
$params = array_merge($_GET, $_POST, $input);

$operation = $params['operation'] ?? '';
            // Check if user exists
            $stmt = $conn->prepare("SELECT userid FROM User WHERE userid = :userid");
            $stmt->execute([":userid" => $userid]);
$api = new AdmissionAPI();
                $this->respond(["success" => false, "error" => "Invalid user ID"], 422);
switch ($operation) {
    case 'getAllAdmissions':
        $api->getAllAdmissions();
        break;
                SET patientid = :patientid, userid = :userid, admission_date = :admission_date, status = :status
        $api->insertAdmission($jsonData);
        break;
    case 'updateAdmission':
        $api->updateAdmission($jsonData);
                ":userid" => $userid,
    case 'deleteAdmission':
        $api->deleteAdmission($admissionid);
        break;
    default:
        http_response_code(400);
        echo json_encode(["error" => "Invalid operation"]);
}
?>
