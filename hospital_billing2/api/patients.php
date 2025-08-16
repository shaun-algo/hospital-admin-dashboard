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

class Patient {
    private function connect() {
        include "connection.php";
        return (new Database())->connect();
    }

    function getAllPatients() {
        try {
            $conn = $this->connect();
            $stmt = $conn->prepare("SELECT * FROM Patient ORDER BY fullname");
            $stmt->execute();
            echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC) ?: []);
        } catch (Exception $e) {
            echo json_encode(["error" => $e->getMessage()]);
        }
    }

    function getPatientById($id) {
        try {
            $conn = $this->connect();
            $stmt = $conn->prepare("SELECT * FROM Patient WHERE patientid = :id LIMIT 1");
            $stmt->bindParam(":id", $id, PDO::PARAM_INT);
            $stmt->execute();
            echo json_encode($stmt->fetch(PDO::FETCH_ASSOC) ?: []);
        } catch (Exception $e) {
            echo json_encode(["error" => $e->getMessage()]);
        }
    }

    function insertPatient($data) {
        try {
            $conn = $this->connect();
            $data = is_array($data) ? $data : json_decode($data, true);

            if (empty($data['fullname']) || empty($data['gender']) || empty($data['contact_no']) || empty($data['address'])) {
                echo json_encode(["success" => false, "error" => "Missing required fields"]);
                return;
            }

            $stmt = $conn->prepare("INSERT INTO Patient (fullname, gender, contact_no, address)
                                    VALUES (:fullname, :gender, :contact_no, :address)");
            $stmt->execute([
                ":fullname" => $data['fullname'],
                ":gender" => $data['gender'],
                ":contact_no" => $data['contact_no'],
                ":address" => $data['address']
            ]);

            echo json_encode(["success" => true]);
        } catch (Exception $e) {
            echo json_encode(["success" => false, "error" => $e->getMessage()]);
        }
    }

    function updatePatient($data) {
        try {
            $conn = $this->connect();
            $data = is_array($data) ? $data : json_decode($data, true);

            if (empty($data['patientid']) || empty($data['fullname']) || empty($data['gender']) || empty($data['contact_no']) || empty($data['address'])) {
                echo json_encode(["success" => false, "error" => "Missing required fields"]);
                return;
            }

            $stmt = $conn->prepare("UPDATE Patient SET fullname=:fullname, gender=:gender, contact_no=:contact_no, address=:address WHERE patientid=:patientid");
            $stmt->execute([
                ":fullname" => $data['fullname'],
                ":gender" => $data['gender'],
                ":contact_no" => $data['contact_no'],
                ":address" => $data['address'],
                ":patientid" => $data['patientid']
            ]);

            echo json_encode(["success" => true]);
        } catch (Exception $e) {
            echo json_encode(["success" => false, "error" => $e->getMessage()]);
        }
    }

    function deletePatient($id) {
        try {
            $conn = $this->connect();
            $stmt = $conn->prepare("DELETE FROM Patient WHERE patientid = :id");
            $stmt->bindParam(":id", $id, PDO::PARAM_INT);
            $stmt->execute();

            echo json_encode(["success" => true]);
        } catch (Exception $e) {
            echo json_encode(["success" => false, "error" => $e->getMessage()]);
        }
    }
}

$raw = json_decode(file_get_contents("php://input"), true) ?? [];
$operation = $_POST['operation'] ?? $_GET['operation'] ?? $raw['operation'] ?? '';
$json = $_POST['json'] ?? $_GET['json'] ?? $raw['json'] ?? '';
$patientid = $_POST['patientid'] ?? $_GET['patientid'] ?? $raw['patientid'] ?? '';

$patient = new Patient();
switch ($operation) {
    case "getAllPatients":
        $patient->getAllPatients();
        break;
    case "getPatientById":
        $patient->getPatientById($patientid);
        break;
    case "insertPatient":
        $patient->insertPatient($json);
        break;
    case "updatePatient":
        $patient->updatePatient($json);
        break;
    case "deletePatient":
        $patient->deletePatient($patientid);
        break;
    default:
        echo json_encode(["error" => "Invalid operation"]);
}
