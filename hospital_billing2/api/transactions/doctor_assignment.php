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

class DoctorAssignment {
    private function connect() {
        include __DIR__ . "/../connection.php";
        return (new Database())->connect();
    }

    private function respond($data, $status = 200) {
        http_response_code($status);
        echo json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
        exit;
    }
    
    private function validateAssignmentData($data) {
        $errors = [];
        
        if (empty($data['admissionid'])) {
            $errors[] = "Admission ID is required";
        }
        
        if (empty($data['doctorid'])) {
            $errors[] = "Doctor ID is required";
        }
        
        if (empty($data['role'])) {
            $errors[] = "Role is required";
        }
        
        return $errors;
    }

    function getAssignmentsByAdmission($admissionid) {
        try {
            if (empty($admissionid)) {
                $this->respond(["error" => "Admission ID is required"], 422);
            }
            $conn = $this->connect();
            $stmt = $conn->prepare("
                SELECT da.assignmentid, da.admissionid, da.doctorid, da.role, da.notes, d.fullname, d.specialty
                FROM Doctor_Assignment da
                JOIN Doctor d ON da.doctorid = d.doctorid
                WHERE da.admissionid = :admissionid
                ORDER BY da.assignmentid DESC
            ");
            $stmt->bindParam(":admissionid", $admissionid, PDO::PARAM_INT);
            $stmt->execute();
            $this->respond($stmt->fetchAll(PDO::FETCH_ASSOC) ?: []);
        } catch (Exception $e) {
            $this->respond(["error" => $e->getMessage()], 500);
        }
    }

    function insertAssignment($data) {
        try {
            $conn = $this->connect();

            // Normalize payload
            if (!is_array($data)) {
                $data = json_decode($data ?? "{}", true);
            }
            if (!is_array($data)) {
                $this->respond(["success" => false, "error" => "Invalid data format"], 422);
            }

            // Validate data
            $validationErrors = $this->validateAssignmentData($data);
            if (!empty($validationErrors)) {
                $this->respond([
                    "success" => false, 
                    "error" => "Validation failed", 
                    "validation_errors" => $validationErrors
                ], 422);
            }

            $admissionid = $data['admissionid'];
            $doctorid    = $data['doctorid'];
            $role        = $data['role'];
            $notes       = $data['notes'] ?? '';
            
            // Check if doctor is already assigned with the same role
            $checkStmt = $conn->prepare("
                SELECT COUNT(*) as count FROM Doctor_Assignment 
                WHERE admissionid = :admissionid AND doctorid = :doctorid AND role = :role
            ");
            $checkStmt->execute([
                ":admissionid" => $admissionid,
                ":doctorid"    => $doctorid,
                ":role"        => $role
            ]);
            $result = $checkStmt->fetch(PDO::FETCH_ASSOC);
            
            if ($result['count'] > 0) {
                $this->respond([
                    "success" => false, 
                    "error" => "This doctor is already assigned with the same role for this admission"
                ], 409); // 409 Conflict
            }

            $stmt = $conn->prepare("
                INSERT INTO Doctor_Assignment (admissionid, doctorid, role, notes)
                VALUES (:admissionid, :doctorid, :role, :notes)
            ");
            $stmt->execute([
                ":admissionid" => $admissionid,
                ":doctorid"    => $doctorid,
                ":role"        => $role,
                ":notes"       => $notes
            ]);

            $lastId = $conn->lastInsertId();
            
            // Get the newly created assignment with doctor details
            $getStmt = $conn->prepare("
                SELECT da.*, d.fullname, d.specialty 
                FROM Doctor_Assignment da
                JOIN Doctor d ON da.doctorid = d.doctorid
                WHERE da.assignmentid = :assignmentid
            ");
            $getStmt->execute([":assignmentid" => $lastId]);
            $assignment = $getStmt->fetch(PDO::FETCH_ASSOC);
            
            $this->respond([
                "success" => true, 
                "message" => "Doctor assignment created successfully",
                "assignmentid" => $lastId,
                "assignment" => $assignment
            ], 201);
        } catch (Exception $e) {
            $this->respond(["success" => false, "error" => $e->getMessage()], 500);
        }
    }

    function updateAssignment($data) {
        try {
            $conn = $this->connect();

            if (!is_array($data)) {
                $data = json_decode($data ?? "{}", true);
            }
            if (!is_array($data)) {
                $this->respond(["success" => false, "error" => "Invalid data format"], 422);
            }

            // Check if assignment exists
            $assignmentid = $data['assignmentid'] ?? null;
            if (empty($assignmentid)) {
                $this->respond(["success" => false, "error" => "Assignment ID is required"], 422);
            }
            
            // Validate data
            $validationErrors = $this->validateAssignmentData($data);
            if (!empty($validationErrors)) {
                $this->respond([
                    "success" => false, 
                    "error" => "Validation failed", 
                    "validation_errors" => $validationErrors
                ], 422);
            }

            $doctorid = $data['doctorid'];
            $role     = $data['role'];
            $notes    = $data['notes'] ?? '';
            
            // Check if assignment exists
            $checkStmt = $conn->prepare("SELECT admissionid FROM Doctor_Assignment WHERE assignmentid = :assignmentid");
            $checkStmt->execute([":assignmentid" => $assignmentid]);
            $existingAssignment = $checkStmt->fetch(PDO::FETCH_ASSOC);
            
            if (!$existingAssignment) {
                $this->respond(["success" => false, "error" => "Assignment not found"], 404);
            }
            
            // Check if doctor is already assigned with the same role (excluding this assignment)
            $checkStmt = $conn->prepare("
                SELECT COUNT(*) as count FROM Doctor_Assignment 
                WHERE admissionid = :admissionid 
                AND doctorid = :doctorid 
                AND role = :role 
                AND assignmentid != :assignmentid
            ");
            $checkStmt->execute([
                ":admissionid" => $existingAssignment['admissionid'],
                ":doctorid"    => $doctorid,
                ":role"        => $role,
                ":assignmentid"=> $assignmentid
            ]);
            $result = $checkStmt->fetch(PDO::FETCH_ASSOC);
            
            if ($result['count'] > 0) {
                $this->respond([
                    "success" => false, 
                    "error" => "This doctor is already assigned with the same role for this admission"
                ], 409); // 409 Conflict
            }

            $stmt = $conn->prepare("
                UPDATE Doctor_Assignment
                SET doctorid = :doctorid, role = :role, notes = :notes
                WHERE assignmentid = :assignmentid
            ");
            $stmt->execute([
                ":doctorid"    => $doctorid,
                ":role"        => $role,
                ":notes"       => $notes,
                ":assignmentid"=> $assignmentid
            ]);
            
            // Get the updated assignment with doctor details
            $getStmt = $conn->prepare("
                SELECT da.*, d.fullname, d.specialty 
                FROM Doctor_Assignment da
                JOIN Doctor d ON da.doctorid = d.doctorid
                WHERE da.assignmentid = :assignmentid
            ");
            $getStmt->execute([":assignmentid" => $assignmentid]);
            $assignment = $getStmt->fetch(PDO::FETCH_ASSOC);

            $this->respond([
                "success" => true, 
                "message" => "Doctor assignment updated successfully",
                "assignment" => $assignment
            ]);
        } catch (Exception $e) {
            $this->respond(["success" => false, "error" => $e->getMessage()], 500);
        }
    }

    function deleteAssignment($id) {
        try {
            if (empty($id)) {
                $this->respond(["success" => false, "error" => "Assignment ID is required"], 422);
            }
            
            $conn = $this->connect();
            
            // First check if the assignment exists
            $checkStmt = $conn->prepare("SELECT assignmentid, doctorid FROM Doctor_Assignment WHERE assignmentid = :id");
            $checkStmt->bindParam(":id", $id, PDO::PARAM_INT);
            $checkStmt->execute();
            $assignment = $checkStmt->fetch(PDO::FETCH_ASSOC);
            
            if (!$assignment) {
                $this->respond(["success" => false, "error" => "Assignment not found"], 404);
            }
            
            // Get doctor details before deletion for the response
            $doctorStmt = $conn->prepare("SELECT fullname FROM Doctor WHERE doctorid = :doctorid");
            $doctorStmt->bindParam(":doctorid", $assignment['doctorid'], PDO::PARAM_INT);
            $doctorStmt->execute();
            $doctor = $doctorStmt->fetch(PDO::FETCH_ASSOC);
            
            // Delete the assignment
            $stmt = $conn->prepare("DELETE FROM Doctor_Assignment WHERE assignmentid = :id");
            $stmt->bindParam(":id", $id, PDO::PARAM_INT);
            $stmt->execute();
            
            if ($stmt->rowCount() === 0) {
                $this->respond(["success" => false, "error" => "Failed to delete assignment"], 500);
            }
            
            $this->respond([
                "success" => true, 
                "message" => "Assignment deleted successfully",
                "deleted_assignment" => [
                    "assignmentid" => $id,
                    "doctor_name" => $doctor['fullname'] ?? 'Unknown'
                ]
            ]);
        } catch (Exception $e) {
            $this->respond(["success" => false, "error" => $e->getMessage()], 500);
        }
    }
}

// --- Entry point ---
$input = json_decode(file_get_contents("php://input"), true) ?? [];
$params = array_merge($_GET, $_POST, $input);

$operation    = $params['operation'] ?? '';
$assignmentid = $params['assignmentid'] ?? '';
$admissionid  = $params['admissionid'] ?? '';
$doctorid     = $params['doctorid'] ?? '';
$role         = $params['role'] ?? '';
$notes        = $params['notes'] ?? '';
$jsonData     = $params['json'] ?? $input; // <- unified parsing

$doctorAssignment = new DoctorAssignment();

switch ($operation) {
    case 'getAssignmentsByAdmission':
        $doctorAssignment->getAssignmentsByAdmission($admissionid);
        break;
    case 'insertAssignment':
        $doctorAssignment->insertAssignment($jsonData);
        break;
    case 'updateAssignment':
        $doctorAssignment->updateAssignment($jsonData);
        break;
    case 'deleteAssignment':
        $doctorAssignment->deleteAssignment($assignmentid);
        break;
    default:
        echo json_encode(["error" => "Invalid operation"]);
}
