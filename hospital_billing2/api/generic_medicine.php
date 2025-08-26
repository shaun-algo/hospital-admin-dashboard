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

include "connection.php";

class GenericMedicine {
    private $conn;

    public function __construct() {
        $this->conn = (new Database())->connect();
    }

    private function respond($data, $status = 200) {
        http_response_code($status);
        echo json_encode($data);
        exit;
    }

    public function getAllGenericMedicines() {
        try {
            $stmt = $this->conn->prepare("SELECT genericid, generic_name FROM Generic_Medicine WHERE is_deleted = 0 ORDER BY generic_name");
            $stmt->execute();
            $data = $stmt->fetchAll(PDO::FETCH_ASSOC);
            $this->respond(["success" => true, "data" => $data]);
        } catch (Exception $e) {
            $this->respond(["success" => false, "error" => "Failed to load generic medicines: " . $e->getMessage()], 500);
        }
    }

    public function insertGenericMedicine($data) {
        try {
            if (empty($data['generic_name']) || strlen(trim($data['generic_name'])) === 0) {
                $this->respond(["success" => false, "error" => "Generic medicine name required"], 422);
            }

            $stmt = $this->conn->prepare("SELECT COUNT(*) FROM Generic_Medicine WHERE generic_name = :name AND is_deleted = 0");
            $stmt->execute([':name' => trim($data['generic_name'])]);
            if ($stmt->fetchColumn() > 0) {
                $this->respond(["success" => false, "error" => "Generic medicine with this name already exists"], 422);
            }

            $stmt = $this->conn->prepare("INSERT INTO Generic_Medicine (generic_name, is_deleted) VALUES (:name, 0)");
            $stmt->execute([':name' => trim($data['generic_name'])]);

            $this->respond(["success" => true, "id" => $this->conn->lastInsertId()], 201);
        } catch (Exception $e) {
            $this->respond(["success" => false, "error" => "Failed to insert generic medicine: " . $e->getMessage()], 500);
        }
    }

    public function updateGenericMedicine($data) {
        try {
            if (empty($data['genericid']) || !filter_var($data['genericid'], FILTER_VALIDATE_INT)) {
                $this->respond(["success" => false, "error" => "Missing or invalid generic medicine ID"], 422);
            }
            if (empty($data['generic_name']) || strlen(trim($data['generic_name'])) === 0) {
                $this->respond(["success" => false, "error" => "Generic medicine name required"], 422);
            }

            // Check exists
            $stmt = $this->conn->prepare("SELECT COUNT(*) FROM Generic_Medicine WHERE genericid = :id AND is_deleted = 0");
            $stmt->execute([':id' => (int)$data['genericid']]);
            if ($stmt->fetchColumn() == 0) {
                $this->respond(["success" => false, "error" => "Generic medicine not found"], 404);
            }

            // Check unique name except this record
            $stmt = $this->conn->prepare("SELECT COUNT(*) FROM Generic_Medicine WHERE generic_name = :name AND genericid != :id AND is_deleted = 0");
            $stmt->execute([
                ':name' => trim($data['generic_name']),
                ':id' => (int)$data['genericid']
            ]);
            if ($stmt->fetchColumn() > 0) {
                $this->respond(["success" => false, "error" => "Another generic medicine with this name already exists"], 422);
            }

            $stmt = $this->conn->prepare("UPDATE Generic_Medicine SET generic_name = :name WHERE genericid = :id");
            $stmt->execute([
                ':name' => trim($data['generic_name']),
                ':id' => (int)$data['genericid']
            ]);

            $this->respond(["success" => true]);
        } catch (Exception $e) {
            $this->respond(["success" => false, "error" => "Failed to update generic medicine: " . $e->getMessage()], 500);
        }
    }

    public function deleteGenericMedicine($genericid) {
        try {
            if (empty($genericid) || !filter_var($genericid, FILTER_VALIDATE_INT)) {
                $this->respond(["success" => false, "error" => "Missing or invalid generic medicine ID"], 422);
            }

            // Check if referenced by medicines
            $stmt = $this->conn->prepare("SELECT COUNT(*) FROM Medicine WHERE genericid = :id AND is_deleted = 0");
            $stmt->execute([':id' => (int)$genericid]);
            if ($stmt->fetchColumn() > 0) {
                $this->respond(["success" => false, "error" => "Cannot delete generic medicine referenced by medicines"], 422);
            }

            $stmt = $this->conn->prepare("UPDATE Generic_Medicine SET is_deleted = 1 WHERE genericid = :id");
            $stmt->execute([':id' => (int)$genericid]);

            $this->respond(["success" => true, "message" => "Generic medicine deleted (soft)"]);
        } catch (Exception $e) {
            $this->respond(["success" => false, "error" => "Failed to delete generic medicine: " . $e->getMessage()], 500);
        }
    }
}


// Router and request handling
$operation = $_REQUEST['operation'] ?? null;
if (!$operation) {
    http_response_code(400);
    echo json_encode(["success" => false, "error" => "Missing operation parameter"]);
    exit;
}

$rawInput = file_get_contents("php://input");
$jsonData = $_SERVER['REQUEST_METHOD'] === 'POST' ? json_decode($rawInput, true) : null;

if (json_last_error() !== JSON_ERROR_NONE && $operation !== 'getAllGenericMedicines') {
    http_response_code(400);
    echo json_encode(["success" => false, "error" => "Invalid JSON input: " . json_last_error_msg()]);
    exit;
}

$genericid = $_REQUEST['genericid'] ?? null;

$genericMedicine = new GenericMedicine();

switch ($operation) {
    case 'getAllGenericMedicines':
        $genericMedicine->getAllGenericMedicines();
        break;
    case 'insertGenericMedicine':
        if (!is_array($jsonData)) {
            http_response_code(400);
            echo json_encode(["success" => false, "error" => "Invalid input data"]);
            exit;
        }
        $genericMedicine->insertGenericMedicine($jsonData);
        break;
    case 'updateGenericMedicine':
        if (!is_array($jsonData)) {
            http_response_code(400);
            echo json_encode(["success" => false, "error" => "Invalid input data"]);
            exit;
        }
        $genericMedicine->updateGenericMedicine($jsonData);
        break;
    case 'deleteGenericMedicine':
        $genericMedicine->deleteGenericMedicine($genericid);
        break;
    default:
        http_response_code(400);
        echo json_encode(["success" => false, "error" => "Invalid operation"]);
        break;
}
