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

class Doctor {
    private function connect() {
        include "connection.php";
        return (new Database())->connect();
    }

    function getAllDoctors() {
        try {
            $conn = $this->connect();
            $stmt = $conn->prepare("SELECT doctorid, fullname, specialty, contact_no, status FROM Doctor ORDER BY fullname");
            $stmt->execute();
            echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
        } catch (Exception $e) {
            echo json_encode(["error" => $e->getMessage()]);
        }
    }

    function getDoctorById($id) {
        try {
            if (empty($id)) {
                echo json_encode(["error" => "Doctor ID is required"]);
                return;
            }
            $conn = $this->connect();
            $stmt = $conn->prepare("SELECT doctorid, fullname, specialty, contact_no, status FROM Doctor WHERE doctorid = :id LIMIT 1");
            $stmt->bindParam(":id", $id, PDO::PARAM_INT);
            $stmt->execute();
            echo json_encode($stmt->fetch(PDO::FETCH_ASSOC) ?: []);
        } catch (Exception $e) {
            echo json_encode(["error" => $e->getMessage()]);
        }
    }

    function insertDoctor($data) {
        try {
            $conn = $this->connect();
            if (empty($data['fullname']) || empty($data['specialty']) || empty($data['contact_no']) || empty($data['status'])) {
                echo json_encode(["success" => false, "error" => "Missing required fields"]);
                return;
            }
            $stmt = $conn->prepare("INSERT INTO Doctor (fullname, specialty, contact_no, status) VALUES (:fullname, :specialty, :contact_no, :status)");
            $stmt->execute([
                ":fullname" => $data['fullname'],
                ":specialty" => $data['specialty'],
                ":contact_no" => $data['contact_no'],
                ":status" => $data['status']
            ]);
            echo json_encode(["success" => true, "doctorid" => $conn->lastInsertId()]);
        } catch (Exception $e) {
            echo json_encode(["success" => false, "error" => $e->getMessage()]);
        }
    }

    function updateDoctor($data) {
        try {
            $conn = $this->connect();
            if (empty($data['doctorid']) || empty($data['fullname']) || empty($data['specialty']) || empty($data['contact_no']) || empty($data['status'])) {
                echo json_encode(["success" => false, "error" => "Missing required fields"]);
                return;
            }
            $stmt = $conn->prepare("UPDATE Doctor SET fullname=:fullname, specialty=:specialty, contact_no=:contact_no, status=:status WHERE doctorid=:doctorid");
            $stmt->execute([
                ":fullname" => $data['fullname'],
                ":specialty" => $data['specialty'],
                ":contact_no" => $data['contact_no'],
                ":status" => $data['status'],
                ":doctorid" => $data['doctorid']
            ]);
            echo json_encode(["success" => true]);
        } catch (Exception $e) {
            echo json_encode(["success" => false, "error" => $e->getMessage()]);
        }
    }

    function deleteDoctor($id) {
        try {
            if (empty($id)) {
                echo json_encode(["success" => false, "error" => "Doctor ID is required"]);
                return;
            }
            $conn = $this->connect();
            $stmt = $conn->prepare("DELETE FROM Doctor WHERE doctorid = :id");
            $stmt->bindParam(":id", $id, PDO::PARAM_INT);
            $stmt->execute();
            echo json_encode(["success" => true]);
        } catch (Exception $e) {
            echo json_encode(["success" => false, "error" => $e->getMessage()]);
        }
    }
}

// ===== REQUEST HANDLING =====
$input = json_decode(file_get_contents("php://input"), true) ?? [];
$params = array_merge($_GET, $_POST, $input);

$operation = $params['operation'] ?? '';
$doctorid  = $params['doctorid'] ?? '';
$jsonData  = is_array($params['json'] ?? null) ? $params['json'] : json_decode($params['json'] ?? "{}", true);
if (empty($jsonData) && !empty($input) && $operation !== 'getAllDoctors') {
    $jsonData = $input;
}

$doctor = new Doctor();
switch ($operation) {
    case "getAllDoctors":
        $doctor->getAllDoctors();
        break;
    case "getDoctorById":
        $doctor->getDoctorById($doctorid);
        break;
    case "insertDoctor":
        $doctor->insertDoctor($jsonData);
        break;
    case "updateDoctor":
        $doctor->updateDoctor($jsonData);
        break;
    case "deleteDoctor":
        $doctor->deleteDoctor($doctorid);
        break;
    default:
        echo json_encode(["error" => "Invalid operation: {$operation}"]);
}
