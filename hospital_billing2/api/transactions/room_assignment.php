<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");


include_once __DIR__ . '/../connection.php';

class RoomAssignment {
    private $conn;
    private $table_name = "Room_Assignment";

    public function __construct($db) {
        $this->conn = $db;
    }

    public function read() {
        $query = "SELECT ra.assignmentid AS assignment_id, ra.admissionid AS admission_id, ra.room_no, ra.start_date AS assigned_date,
                         p.fullname AS patient_name, r.categoryid, rc.name AS category_name
                  FROM " . $this->table_name . " ra
                  LEFT JOIN Admission a ON ra.admissionid = a.admissionid
                  LEFT JOIN Patient p ON a.patientid = p.patientid
                  LEFT JOIN Room r ON ra.room_no = r.room_no
                  LEFT JOIN Room_Category rc ON r.categoryid = rc.categoryid
                  ORDER BY ra.assignmentid DESC";

        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        return $stmt;
    }

    public function create($data) {
        $query = "INSERT INTO " . $this->table_name . " (admissionid, room_no, start_date)
                  VALUES (:admissionid, :room_no, :start_date)";
        $stmt = $this->conn->prepare($query);

        $stmt->bindParam(':admissionid', $data->admission_id);
        $stmt->bindParam(':room_no', $data->room_no);
        $stmt->bindParam(':start_date', $data->assigned_date);

        return $stmt->execute();
    }

    public function update($data) {
        $query = "UPDATE " . $this->table_name . " SET admissionid = :admissionid, room_no = :room_no, start_date = :start_date WHERE assignmentid = :assignmentid";
        $stmt = $this->conn->prepare($query);

        $stmt->bindParam(':assignmentid', $data->assignment_id);
        $stmt->bindParam(':admissionid', $data->admission_id);
        $stmt->bindParam(':room_no', $data->room_no);
        $stmt->bindParam(':start_date', $data->assigned_date);

        return $stmt->execute();
    }

    public function delete($id) {
        $query = "DELETE FROM " . $this->table_name . " WHERE assignmentid = :assignmentid";
        $stmt = $this->conn->prepare($query);

        $stmt->bindParam(':assignmentid', $id);

        return $stmt->execute();
    }
}

$database = new Database();
$db = $database->getConnection();

$roomAssignment = new RoomAssignment($db);

$method = $_SERVER['REQUEST_METHOD'];
$input = json_decode(file_get_contents("php://input"));

switch($method) {
    case 'GET':
        $stmt = $roomAssignment->read();
        $assignments = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode($assignments);
        break;

    case 'POST':
        if ($roomAssignment->create($input)) {
            echo json_encode(["message" => "Room assignment created successfully"]);
        } else {
            echo json_encode(["message" => "Failed to create assignment"]);
        }
        break;

    case 'PUT':
        if ($roomAssignment->update($input)) {
            echo json_encode(["message" => "Room assignment updated successfully"]);
        } else {
            echo json_encode(["message" => "Failed to update assignment"]);
        }
        break;

    case 'DELETE':
        if (!empty($input->assignment_id) && $roomAssignment->delete($input->assignment_id)) {
            echo json_encode(["message" => "Room assignment deleted successfully"]);
        } else {
            echo json_encode(["message" => "Failed to delete assignment"]);
        }
        break;

    default:
        http_response_code(405);
        echo json_encode(["message" => "Method not allowed"]);
}
