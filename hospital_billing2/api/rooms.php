<?php
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
  http_response_code(204);
  exit;
}

class Room {
  private function connect() {
    include "connection.php"; // Database class returning PDO
    return (new Database())->connect();
  }

  private function respond($data, $status = 200) {
    http_response_code($status);
    echo json_encode($data);
    exit;
  }

  private function validateRoomData($data) {
    $missing = [];
    if (empty($data['room_no'])) $missing[] = 'room_no';
    if (empty($data['categoryid'])) $missing[] = 'categoryid';
    if (!isset($data['floorid'])) $missing[] = 'floorid';
    if (empty($data['status'])) $missing[] = 'status';

    if (count($missing) > 0) {
      $this->respond([
        "success" => false,
        "error" => "Missing required fields: " . implode(", ", $missing)
      ], 422);
    }
  }

  function getAllRooms() {
    try {
      $conn = $this->connect();
      $stmt = $conn->prepare("
        SELECT r.room_no, r.categoryid, r.floorid, r.status,
               c.name AS category_name,
               f.name AS floor_name
        FROM Room r
        LEFT JOIN Room_Category c ON r.categoryid = c.categoryid
        LEFT JOIN Floor f ON r.floorid = f.floorid
        ORDER BY r.room_no
      ");
      $stmt->execute();
      $rooms = $stmt->fetchAll(PDO::FETCH_ASSOC);
      $this->respond($rooms);
    } catch (Exception $e) {
      $this->respond(["error" => "Failed to get rooms: " . $e->getMessage()], 500);
    }
  }

  function insertRoom($data) {
    try {
      $conn = $this->connect();
      $data = is_array($data) ? $data : json_decode($data, true);
      $this->validateRoomData($data);

      // Prevent duplicate room_no
      $check = $conn->prepare("SELECT COUNT(*) FROM Room WHERE room_no = :room_no");
      $check->execute([":room_no" => $data['room_no']]);
      if ($check->fetchColumn() > 0) {
        $this->respond(["success" => false, "error" => "Room number already exists"], 409);
      }

      $stmt = $conn->prepare("INSERT INTO Room (room_no, categoryid, floorid, status)
                              VALUES (:room_no, :categoryid, :floorid, :status)");
      $stmt->execute([
        ":room_no" => $data['room_no'],
        ":categoryid" => $data['categoryid'],
        ":floorid" => $data['floorid'],
        ":status" => $data['status'],
      ]);
      $this->respond(["success" => true, "room_no" => $data['room_no']], 201);
    } catch (PDOException $e) {
      $this->respond(["success" => false, "error" => "Insert failed: " . $e->getMessage()], 500);
    }
  }

  function updateRoom($data) {
    try {
      $conn = $this->connect();
      $data = is_array($data) ? $data : json_decode($data, true);
      $this->validateRoomData($data);

      $stmt = $conn->prepare("UPDATE Room
                              SET categoryid = :categoryid,
                                  floorid = :floorid,
                                  status = :status
                              WHERE room_no = :room_no");
      $stmt->execute([
        ":categoryid" => $data['categoryid'],
        ":floorid" => $data['floorid'],
        ":status" => $data['status'],
        ":room_no" => $data['room_no']
      ]);

      $this->respond(["success" => true, "message" => "Room updated"]);
    } catch (PDOException $e) {
      $this->respond(["success" => false, "error" => "Update failed: " . $e->getMessage()], 500);
    }
  }

  function deleteRoom($room_no) {
    try {
      if (empty($room_no)) {
        $this->respond(["success" => false, "error" => "Room number is required"], 422);
      }
      $conn = $this->connect();

      $stmt = $conn->prepare("DELETE FROM Room WHERE room_no = :room_no");
      $stmt->bindParam(":room_no", $room_no, PDO::PARAM_STR);
      $stmt->execute();

      $this->respond(["success" => true, "message" => "Room deleted"]);
    } catch (Exception $e) {
      $this->respond(["success" => false, "error" => "Delete failed: " . $e->getMessage()], 500);
    }
  }
}

// --- ROUTER ---
$input = json_decode(file_get_contents("php://input"), true) ?? [];
$params = array_merge($_GET, $_POST, $input);
$operation = $params['operation'] ?? '';
$room_no = $params['roomid'] ?? $params['room_no'] ?? '';
$jsonData = [];

if (!empty($params['json'])) {
  $jsonData = is_array($params['json']) ? $params['json'] : json_decode($params['json'], true);
} else if (!empty($input) && !in_array($operation, ['getAllRooms', 'deleteRoom'])) {
  $jsonData = $input;
}

$room = new Room();

switch ($operation) {
  case 'getAllRooms':
    $room->getAllRooms();
    break;
  case 'insertRoom':
    $room->insertRoom($jsonData);
    break;
  case 'updateRoom':
    $room->updateRoom($jsonData);
    break;
  case 'deleteRoom':
    $room->deleteRoom($room_no);
    break;
  default:
    echo json_encode(["error" => "Invalid operation"]);
    break;
}
?>
