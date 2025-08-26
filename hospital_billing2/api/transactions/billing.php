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

class BillingAPI {
    private function connect() {
        include __DIR__ . "/../connection.php";
        return (new Database())->connect();
    }

    private function respond($data, $status = 200) {
        http_response_code($status);
        echo json_encode($data);
        exit;
    }
    
    private function validateInput($data, $requiredFields = []) {
        if (!is_array($data)) {
            $data = json_decode($data ?? "{}", true);
            if (!is_array($data)) {
                $this->respond(["success" => false, "error" => "Invalid data format"], 422);
            }
        }
        
        $missingFields = [];
        foreach ($requiredFields as $field) {
            if (empty($data[$field])) {
                $missingFields[] = $field;
            }
        }
        
        if (!empty($missingFields)) {
            $this->respond([
                "success" => false, 
                "error" => "Missing required fields: " . implode(", ", $missingFields)
            ], 422);
        }
        
        return $data;
    }

    function getAllBillings($admissionId = null) {
        try {
            $conn = $this->connect();
            $sql = "SELECT b.*, bc.name as category_name 
                   FROM Billing b 
                   JOIN Billing_Category bc ON b.billing_categoryid = bc.billing_categoryid";
            
            $params = [];
            if ($admissionId) {
                $sql .= " WHERE b.admissionid = :admissionid";
                $params[":admissionid"] = $admissionId;
            }
            
            $sql .= " ORDER BY b.billing_date DESC";
            
            $stmt = $conn->prepare($sql);
            $stmt->execute($params);
            $this->respond($stmt->fetchAll(PDO::FETCH_ASSOC) ?: []);
        } catch (Exception $e) {
            $this->respond(["error" => $e->getMessage()], 500);
        }
    }

    function getBillingById($id) {
        try {
            if (empty($id)) $this->respond(["error" => "Billing ID required"], 422);
            
            $conn = $this->connect();
            $stmt = $conn->prepare("SELECT b.*, bc.name as category_name 
                                  FROM Billing b 
                                  JOIN Billing_Category bc ON b.billing_categoryid = bc.billing_categoryid 
                                  WHERE b.billingid = :id");
            $stmt->execute([":id" => $id]);
            
            $billing = $stmt->fetch(PDO::FETCH_ASSOC);
            if (!$billing) {
                $this->respond(["error" => "Billing not found"], 404);
            }
            
            $this->respond($billing);
        } catch (Exception $e) {
            $this->respond(["error" => $e->getMessage()], 500);
        }
    }

    function insertBilling($data) {
        try {
            $data = $this->validateInput($data, ['admissionid', 'billing_categoryid', 'unit_price']);
            
            $admissionid = $data['admissionid'];
            $billing_categoryid = $data['billing_categoryid'];
            $description = $data['description'] ?? null;
            $quantity = $data['quantity'] ?? 1;
            $unit_price = $data['unit_price'];
            
            // Calculate total amount
            $total_amount = $quantity * $unit_price;

            // Validate foreign keys
            $conn = $this->connect();
            
            // Check if admission exists
            $stmt = $conn->prepare("SELECT admissionid FROM Admission WHERE admissionid = :admissionid");
            $stmt->execute([":admissionid" => $admissionid]);
            if (!$stmt->fetch()) {
                $this->respond(["success" => false, "error" => "Invalid admission ID"], 422);
            }
            
            // Check if billing category exists
            $stmt = $conn->prepare("SELECT billing_categoryid FROM Billing_Category WHERE billing_categoryid = :billing_categoryid");
            $stmt->execute([":billing_categoryid" => $billing_categoryid]);
            if (!$stmt->fetch()) {
                $this->respond(["success" => false, "error" => "Invalid billing category ID"], 422);
            }

            $stmt = $conn->prepare("
                INSERT INTO Billing (admissionid, billing_categoryid, description, quantity, unit_price, total_amount, billing_date)
                VALUES (:admissionid, :billing_categoryid, :description, :quantity, :unit_price, :total_amount, NOW())
            ");
            $stmt->execute([
                ":admissionid" => $admissionid,
                ":billing_categoryid" => $billing_categoryid,
                ":description" => $description,
                ":quantity" => $quantity,
                ":unit_price" => $unit_price,
                ":total_amount" => $total_amount
            ]);

            $this->respond(["success" => true, "billingid" => $conn->lastInsertId()], 201);
        } catch (Exception $e) {
            $this->respond(["success" => false, "error" => $e->getMessage()], 500);
        }
    }

    function updateBilling($data) {
        try {
            $data = $this->validateInput($data, ['billingid', 'admissionid', 'billing_categoryid', 'unit_price']);

            $billingid = $data['billingid'];
            $admissionid = $data['admissionid'];
            $billing_categoryid = $data['billing_categoryid'];
            $description = $data['description'] ?? null;
            $quantity = $data['quantity'] ?? 1;
            $unit_price = $data['unit_price'];
            
            // Calculate total amount
            $total_amount = $quantity * $unit_price;

            // Validate foreign keys
            $conn = $this->connect();
            
            // Check if billing exists
            $stmt = $conn->prepare("SELECT billingid FROM Billing WHERE billingid = :billingid");
            $stmt->execute([":billingid" => $billingid]);
            if (!$stmt->fetch()) {
                $this->respond(["success" => false, "error" => "Billing not found"], 404);
            }
            
            // Check if admission exists
            $stmt = $conn->prepare("SELECT admissionid FROM Admission WHERE admissionid = :admissionid");
            $stmt->execute([":admissionid" => $admissionid]);
            if (!$stmt->fetch()) {
                $this->respond(["success" => false, "error" => "Invalid admission ID"], 422);
            }
            
            // Check if billing category exists
            $stmt = $conn->prepare("SELECT billing_categoryid FROM Billing_Category WHERE billing_categoryid = :billing_categoryid");
            $stmt->execute([":billing_categoryid" => $billing_categoryid]);
            if (!$stmt->fetch()) {
                $this->respond(["success" => false, "error" => "Invalid billing category ID"], 422);
            }

            $stmt = $conn->prepare("
                UPDATE Billing
                SET admissionid = :admissionid, billing_categoryid = :billing_categoryid, 
                    description = :description, quantity = :quantity, 
                    unit_price = :unit_price, total_amount = :total_amount
                WHERE billingid = :billingid
            ");
            $stmt->execute([
                ":admissionid" => $admissionid,
                ":billing_categoryid" => $billing_categoryid,
                ":description" => $description,
                ":quantity" => $quantity,
                ":unit_price" => $unit_price,
                ":total_amount" => $total_amount,
                ":billingid" => $billingid
            ]);

            $this->respond(["success" => true]);
        } catch (Exception $e) {
            $this->respond(["success" => false, "error" => $e->getMessage()], 500);
        }
    }

    function deleteBilling($billingId) {
        try {
            if (!$billingId || !is_numeric($billingId)) {
                $this->respond(["success" => false, "error" => "Invalid billing ID"], 400);
                return;
            }
            
            $conn = $this->connect();
            
            // First check if the billing record exists
            $checkStmt = $conn->prepare("SELECT billingid FROM Billing WHERE billingid = ?");
            $checkStmt->execute([$billingId]);
            
            if ($checkStmt->rowCount() === 0) {
                $this->respond(["success" => false, "error" => "Billing record not found"], 404);
                return;
            }
            
            $stmt = $conn->prepare("DELETE FROM Billing WHERE billingid = ?");
            $stmt->execute([$billingId]);
            
            $this->respond(["success" => true, "message" => "Billing record deleted successfully"]);
        } catch (Exception $e) {
            $this->respond(["success" => false, "error" => $e->getMessage()], 500);
        }
    }
    
    function getBillingsByCategory($admissionId) {
        try {
            if (!$admissionId || !is_numeric($admissionId)) {
                $this->respond(["success" => false, "error" => "Invalid admission ID"], 400);
                return;
            }
            
            $conn = $this->connect();
            
            // Verify admission exists
            $checkStmt = $conn->prepare("SELECT admissionid FROM Admission WHERE admissionid = ?");
            $checkStmt->execute([$admissionId]);
            
            if ($checkStmt->rowCount() === 0) {
                $this->respond(["success" => false, "error" => "Admission not found"], 404);
                return;
            }
            
            $stmt = $conn->prepare("
                SELECT bc.name AS category_name, SUM(b.total_amount) AS total_amount
                FROM Billing b
                JOIN Billing_Category bc ON b.billing_categoryid = bc.billing_categoryid
                WHERE b.admissionid = ?
                GROUP BY bc.billing_categoryid, bc.name
                ORDER BY bc.name
            ");
            $stmt->execute([$admissionId]);
            $this->respond(["success" => true, "data" => $stmt->fetchAll(PDO::FETCH_ASSOC) ?: []]);
        } catch (Exception $e) {
            $this->respond(["success" => false, "error" => $e->getMessage()], 500);
        }
    }
    
    function getTotalBilling($admissionId) {
        try {
            if (!$admissionId || !is_numeric($admissionId)) {
                $this->respond(["success" => false, "error" => "Invalid admission ID"], 400);
                return;
            }
            
            $conn = $this->connect();
            
            // Verify admission exists
            $checkStmt = $conn->prepare("SELECT admissionid FROM Admission WHERE admissionid = ?");
            $checkStmt->execute([$admissionId]);
            
            if ($checkStmt->rowCount() === 0) {
                $this->respond(["success" => false, "error" => "Admission not found"], 404);
                return;
            }
            
            $stmt = $conn->prepare("
                SELECT SUM(total_amount) AS total_amount
                FROM Billing
                WHERE admissionid = ?
            ");
            $stmt->execute([$admissionId]);
            $result = $stmt->fetch(PDO::FETCH_ASSOC);
            $this->respond(["success" => true, "total_amount" => $result['total_amount'] ?: 0]);
        } catch (Exception $e) {
            $this->respond(["success" => false, "error" => $e->getMessage()], 500);
        }
    }
}

// --- Entry point ---
$input = json_decode(file_get_contents("php://input"), true) ?? [];
$params = array_merge($_GET, $_POST, $input);

$operation = $params['operation'] ?? '';
$jsonData  = $params['json'] ?? $input;
$billingid = $params['billingid'] ?? '';
$admissionid = $params['admissionid'] ?? '';

$billing = new BillingAPI();

switch ($operation) {
    case 'getAllBillings':
        $billing->getAllBillings($admissionid);
        break;
    case 'getBillingById':
        $billing->getBillingById($billingid);
        break;
    case 'insertBilling':
        $billing->insertBilling($jsonData);
        break;
    case 'updateBilling':
        $billing->updateBilling($jsonData);
        break;
    case 'deleteBilling':
        $billing->deleteBilling($billingid);
        break;
    case 'getBillingsByCategory':
        $billing->getBillingsByCategory($admissionid);
        break;
    case 'getTotalBilling':
        $billing->getTotalBilling($admissionid);
        break;
    default:
        echo json_encode(["error" => "Invalid operation"]);
}