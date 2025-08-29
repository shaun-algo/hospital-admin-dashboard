-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Aug 28, 2025 at 06:32 PM
-- Server version: 10.4.28-MariaDB
-- PHP Version: 8.0.28

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `hospital_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `Admission`
--

CREATE TABLE `Admission` (
  `admissionid` int(11) NOT NULL,
  `patientid` int(11) DEFAULT NULL,
  `doctorid` int(11) DEFAULT NULL,
  `userid` int(11) DEFAULT NULL,
  `admission_date` datetime DEFAULT current_timestamp(),
  `status` varchar(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `Billing`
--

CREATE TABLE `Billing` (
  `billingid` int(11) NOT NULL,
  `admissionid` int(11) NOT NULL,
  `billing_categoryid` int(11) NOT NULL,
  `description` varchar(200) DEFAULT NULL,
  `quantity` int(11) DEFAULT 1,
  `unit_price` decimal(10,2) DEFAULT NULL,
  `total_amount` decimal(10,2) DEFAULT NULL,
  `billing_date` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `Billing_Category`
--

CREATE TABLE `Billing_Category` (
  `billing_categoryid` int(11) NOT NULL,
  `name` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `Billing_Category`
--

INSERT INTO `Billing_Category` (`billing_categoryid`, `name`) VALUES
(2, 'Laboratory'),
(3, 'Medicine'),
(5, 'Miscellaneous'),
(4, 'Professional Fee'),
(1, 'Room');

-- --------------------------------------------------------

--
-- Table structure for table `Doctor`
--

CREATE TABLE `Doctor` (
  `doctorid` int(11) NOT NULL,
  `fullname` varchar(100) DEFAULT NULL,
  `specialtyid` int(11) DEFAULT NULL,
  `contact_no` varchar(20) DEFAULT NULL,
  `status` varchar(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `Doctor`
--

INSERT INTO `Doctor` (`doctorid`, `fullname`, `specialtyid`, `contact_no`, `status`) VALUES
(1, 'Dr. Maria Santos', 1, '09171234567', 'Active'),
(2, 'Dr. Jose Ramirez', 2, '09181234567', 'Active'),
(3, 'Dr. Liza Dela Cruz', 3, '09991234567', 'Active'),
(4, 'Dr. Roberto Gutierrez', 4, '09181239876', 'Active'),
(5, 'Dr. Angela Manalo', 5, '09221234567', 'Active'),
(6, 'Dr. Carlo Enriquez', 6, '09351234567', 'Active'),
(7, 'Dr. Katrina Uy', 7, '09181237654', 'Active'),
(8, 'Dr. Miguel Villanueva', 8, '09291234567', 'Active'),
(9, 'Dr. Sofia Reyes', 9, '09981234567', 'Active'),
(10, 'Dr. Ramon Aquino', 10, '09161234567', 'Active');

-- --------------------------------------------------------

--
-- Table structure for table `Doctor_Assignment`
--

CREATE TABLE `Doctor_Assignment` (
  `assignmentid` int(11) NOT NULL,
  `admissionid` int(11) DEFAULT NULL,
  `doctorid` int(11) DEFAULT NULL,
  `role` varchar(50) DEFAULT NULL,
  `notes` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `Floor`
--

CREATE TABLE `Floor` (
  `floorid` int(11) NOT NULL,
  `name` varchar(20) NOT NULL,
  `is_deleted` tinyint(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `Floor`
--

INSERT INTO `Floor` (`floorid`, `name`, `is_deleted`) VALUES
(1, 'Ground Floor', 0),
(2, '2nd Floor', 0),
(3, '3rd Floor', 0),
(4, '4th Floor', 0);

-- --------------------------------------------------------

--
-- Table structure for table `Generic_Medicine`
--

CREATE TABLE `Generic_Medicine` (
  `genericid` int(11) NOT NULL,
  `generic_name` varchar(100) NOT NULL,
  `is_deleted` tinyint(1) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `Generic_Medicine`
--

INSERT INTO `Generic_Medicine` (`genericid`, `generic_name`, `is_deleted`) VALUES
(1, 'Paracetamol', 0),
(2, 'Amoxicillin', 0),
(3, 'Metformin', 0),
(4, 'Amlodipine', 0),
(5, 'Ceftriaxone', 0),
(6, 'Omeprazole', 0),
(7, 'Losartan', 0),
(8, 'Ciprofloxacin', 0),
(9, 'GAGUEEEE', 1);

-- --------------------------------------------------------

--
-- Table structure for table `Insurance_Provider`
--

CREATE TABLE `Insurance_Provider` (
  `insuranceid` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `coverage_percent` decimal(5,2) DEFAULT 0.00,
  `description` text DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `Insurance_Provider`
--

INSERT INTO `Insurance_Provider` (`insuranceid`, `name`, `coverage_percent`, `description`, `is_active`) VALUES
(1, 'PhilHealth', 60.00, 'National Health Insurance Program', 1),
(2, 'Maxicare', 80.00, 'Private HMO coverage', 1),
(3, 'Medicard', 75.00, 'Private HMO coverage', 1),
(4, 'Intellicare', 70.00, 'Corporate HMO coverage', 1),
(5, 'Kaiser', 65.00, 'Private insurance provider', 1),
(6, 'test', 89.00, 'test', 0);

-- --------------------------------------------------------

--
-- Table structure for table `Lab_Request`
--

CREATE TABLE `Lab_Request` (
  `lab_requestid` int(11) NOT NULL,
  `admissionid` int(11) DEFAULT NULL,
  `requestedBy` int(11) DEFAULT NULL,
  `testid` int(11) DEFAULT NULL,
  `status` varchar(20) DEFAULT 'Pending'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `Lab_Test`
--

CREATE TABLE `Lab_Test` (
  `testid` int(11) NOT NULL,
  `categoryid` int(11) DEFAULT NULL,
  `name` varchar(100) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `price` decimal(10,2) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `Lab_Test`
--

INSERT INTO `Lab_Test` (`testid`, `categoryid`, `name`, `description`, `price`) VALUES
(1, 1, 'S', 'S', 2.00),
(2, 1, 'Complete Blood Count (CBC)', 'Standard CBC panel', 250.00),
(3, 1, 'Platelet Count', 'Platelet estimation', 180.00),
(4, 2, 'Fasting Blood Sugar', 'Glucose level fasting', 150.00),
(5, 2, 'Lipid Profile', 'Cholesterol & triglycerides', 500.00),
(6, 2, 'Liver Function Test', 'AST, ALT, Bilirubin', 650.00),
(7, 3, 'HIV Test', 'Antibody screening', 450.00),
(8, 4, 'Urine Culture', 'Bacterial culture from urine', 400.00),
(9, 5, 'Chest X-Ray', 'PA view', 300.00),
(10, 5, 'CT Scan - Head', 'Non-contrast head scan', 3500.00),
(11, 5, 'MRI Brain', 'With/without contrast', 7500.00);

-- --------------------------------------------------------

--
-- Table structure for table `Lab_Test_Category`
--

CREATE TABLE `Lab_Test_Category` (
  `labtestcatid` int(11) NOT NULL,
  `name` varchar(100) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `handling_fee` decimal(10,2) DEFAULT 0.00,
  `turnaround_days` int(11) DEFAULT 1,
  `is_active` tinyint(1) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `Lab_Test_Category`
--

INSERT INTO `Lab_Test_Category` (`labtestcatid`, `name`, `description`, `handling_fee`, `turnaround_days`, `is_active`) VALUES
(1, 'X', '', 2.00, 2, 1),
(2, 'Hematology', 'Blood-related diagnostic tests', 50.00, 1, 1),
(3, 'Chemistry', 'Blood chemistry analysis', 75.00, 1, 1),
(4, 'Immunology', 'Immune system tests', 100.00, 2, 1),
(5, 'Microbiology', 'Culture and sensitivity tests', 120.00, 3, 1),
(6, 'Imaging', 'X-ray, CT, MRI scans', 200.00, 1, 1);

-- --------------------------------------------------------

--
-- Table structure for table `Medicine`
--

CREATE TABLE `Medicine` (
  `medicineid` int(11) NOT NULL,
  `genericid` int(11) DEFAULT NULL,
  `brand_name` varchar(100) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `price` decimal(10,2) DEFAULT NULL,
  `is_deleted` tinyint(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `Medicine`
--

INSERT INTO `Medicine` (`medicineid`, `genericid`, `brand_name`, `description`, `price`, `is_deleted`) VALUES
(1, 1, 'Biogesic', '500mg tablet', 5.00, 0),
(2, 1, 'Calpol', 'Syrup 250mg/5ml', 40.00, 0),
(3, 2, 'Amoxil', '500mg capsule', 15.00, 0),
(4, 2, 'Amoclav', '625mg tablet', 25.00, 0),
(5, 3, 'Glucophage', '500mg tablet', 10.00, 0),
(6, 4, 'Norvasc', '5mg tablet', 18.00, 0),
(7, 5, 'Rocephin', '1g vial for injection', 350.00, 0),
(8, 6, 'Losec', '20mg capsule', 20.00, 0),
(9, 7, 'Cozaar', '50mg tablet', 22.00, 0),
(10, 8, 'Ciproxin', '500mg tablet', 28.00, 0),
(11, 9, 'ECCCCCCCVVVV', '12', 12.00, 0);

-- --------------------------------------------------------

--
-- Table structure for table `Patient`
--

CREATE TABLE `Patient` (
  `patientid` int(11) NOT NULL,
  `fullname` varchar(100) NOT NULL,
  `gender` varchar(10) DEFAULT NULL,
  `birthdate` date DEFAULT NULL,
  `contact_no` varchar(20) DEFAULT NULL,
  `address` text DEFAULT NULL,
  `insuranceid` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `Patient`
--

INSERT INTO `Patient` (`patientid`, `fullname`, `gender`, `birthdate`, `contact_no`, `address`, `insuranceid`) VALUES
(1, 'Angeli Gem H. Montalba', 'Female', '2003-08-29', '098812763', 'test', 4);

-- --------------------------------------------------------

--
-- Table structure for table `Payment`
--

CREATE TABLE `Payment` (
  `paymentid` int(11) NOT NULL,
  `admissionid` int(11) DEFAULT NULL,
  `amount` decimal(10,2) DEFAULT NULL,
  `date` datetime DEFAULT current_timestamp(),
  `method` varchar(50) DEFAULT NULL,
  `remarks` text DEFAULT NULL,
  `insuranceid` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `Prescription`
--

CREATE TABLE `Prescription` (
  `prescriptionid` int(11) NOT NULL,
  `admissionid` int(11) DEFAULT NULL,
  `medicineid` int(11) DEFAULT NULL,
  `doctorid` int(11) DEFAULT NULL,
  `quantity` int(11) DEFAULT NULL,
  `status` varchar(20) DEFAULT 'Pending',
  `prescription_date` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `Role`
--

CREATE TABLE `Role` (
  `roleid` int(11) NOT NULL,
  `name` varchar(50) NOT NULL,
  `status` enum('Active','Inactive') DEFAULT 'Active',
  `permissions` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `Role`
--

INSERT INTO `Role` (`roleid`, `name`, `status`, `permissions`) VALUES
(1, 'ADMINISTRATOR', 'Active', 'ALL'),
(2, 'SAMPLE', 'Inactive', 'ALL,Manage Roles,Manage Users,Manage Patients,Manage Doctors,Manage Admissions,Manage Billing,Manage Payments,Manage Rooms,Manage Room Assignments,Manage Lab Tests,Manage Lab Requests,Manage Prescriptions,Manage Doctor Assignments');

-- --------------------------------------------------------

--
-- Table structure for table `Room`
--

CREATE TABLE `Room` (
  `room_no` varchar(20) NOT NULL,
  `categoryid` int(11) DEFAULT NULL,
  `floorid` int(11) DEFAULT NULL,
  `status` varchar(20) DEFAULT 'Available'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `Room`
--

INSERT INTO `Room` (`room_no`, `categoryid`, `floorid`, `status`) VALUES
('101', 1, 1, 'Available'),
('102', 1, 1, 'Occupied'),
('201', 2, 2, 'Available'),
('202', 2, 2, 'Available'),
('301', 3, 3, 'Available'),
('302', 3, 3, 'Occupied'),
('401', 4, 4, 'Available');

-- --------------------------------------------------------

--
-- Table structure for table `Room_Assignment`
--

CREATE TABLE `Room_Assignment` (
  `assignmentid` int(11) NOT NULL,
  `admissionid` int(11) DEFAULT NULL,
  `room_no` varchar(20) DEFAULT NULL,
  `start_date` datetime NOT NULL,
  `end_date` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `Room_Category`
--

CREATE TABLE `Room_Category` (
  `categoryid` int(11) NOT NULL,
  `name` varchar(50) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `rate_per_day` decimal(10,2) DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `Room_Category`
--

INSERT INTO `Room_Category` (`categoryid`, `name`, `description`, `rate_per_day`, `is_active`) VALUES
(1, 'Ward', 'Shared ward, 6–8 beds', 500.00, 1),
(2, 'Semi-Private Room', '2 beds per room', 1200.00, 1),
(3, 'Private Room', 'Single occupancy room', 2500.00, 1),
(4, 'ICU', 'Intensive Care Unit', 5000.00, 1),
(5, 'Deluxe Suite', 'Premium private suite with amenities', 7000.00, 1),
(6, 'TEST', '', 1200.00, 0);

-- --------------------------------------------------------

--
-- Table structure for table `Specialty`
--

CREATE TABLE `Specialty` (
  `specialtyid` int(11) NOT NULL,
  `name` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `Specialty`
--

INSERT INTO `Specialty` (`specialtyid`, `name`) VALUES
(1, 'Cardiology'),
(9, 'Dermatology'),
(10, 'Emergency Medicine'),
(8, 'ENT (Otorhinolaryngology)'),
(5, 'General Surgery'),
(2, 'Internal Medicine'),
(7, 'Neurology'),
(4, 'Obstetrics and Gynecology'),
(6, 'Orthopedics'),
(3, 'Pediatrics');

-- --------------------------------------------------------

--
-- Table structure for table `User`
--

CREATE TABLE `User` (
  `userid` int(11) NOT NULL,
  `roleid` int(11) DEFAULT NULL,
  `username` varchar(50) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `status` varchar(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `User`
--

INSERT INTO `User` (`userid`, `roleid`, `username`, `password`, `status`) VALUES
(1, 1, 'Ivan Pascua', '$2y$10$YyhlORL9U6Q/WyE/weBjn.a.FtXnndoLWB9J5ZtPIyILuw7UeXEBC', 'Inactive');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `Admission`
--
ALTER TABLE `Admission`
  ADD PRIMARY KEY (`admissionid`),
  ADD KEY `patientid` (`patientid`),
  ADD KEY `doctorid` (`doctorid`),
  ADD KEY `userid` (`userid`);

--
-- Indexes for table `Billing`
--
ALTER TABLE `Billing`
  ADD PRIMARY KEY (`billingid`),
  ADD KEY `admissionid` (`admissionid`),
  ADD KEY `billing_categoryid` (`billing_categoryid`);

--
-- Indexes for table `Billing_Category`
--
ALTER TABLE `Billing_Category`
  ADD PRIMARY KEY (`billing_categoryid`),
  ADD UNIQUE KEY `name` (`name`);

--
-- Indexes for table `Doctor`
--
ALTER TABLE `Doctor`
  ADD PRIMARY KEY (`doctorid`),
  ADD KEY `specialtyid` (`specialtyid`);

--
-- Indexes for table `Doctor_Assignment`
--
ALTER TABLE `Doctor_Assignment`
  ADD PRIMARY KEY (`assignmentid`),
  ADD KEY `admissionid` (`admissionid`),
  ADD KEY `doctorid` (`doctorid`);

--
-- Indexes for table `Floor`
--
ALTER TABLE `Floor`
  ADD PRIMARY KEY (`floorid`),
  ADD UNIQUE KEY `name` (`name`);

--
-- Indexes for table `Generic_Medicine`
--
ALTER TABLE `Generic_Medicine`
  ADD PRIMARY KEY (`genericid`),
  ADD UNIQUE KEY `generic_name` (`generic_name`);

--
-- Indexes for table `Insurance_Provider`
--
ALTER TABLE `Insurance_Provider`
  ADD PRIMARY KEY (`insuranceid`),
  ADD UNIQUE KEY `name` (`name`);

--
-- Indexes for table `Lab_Request`
--
ALTER TABLE `Lab_Request`
  ADD PRIMARY KEY (`lab_requestid`),
  ADD KEY `admissionid` (`admissionid`),
  ADD KEY `requestedBy` (`requestedBy`),
  ADD KEY `testid` (`testid`);

--
-- Indexes for table `Lab_Test`
--
ALTER TABLE `Lab_Test`
  ADD PRIMARY KEY (`testid`),
  ADD KEY `categoryid` (`categoryid`);

--
-- Indexes for table `Lab_Test_Category`
--
ALTER TABLE `Lab_Test_Category`
  ADD PRIMARY KEY (`labtestcatid`),
  ADD UNIQUE KEY `name` (`name`);

--
-- Indexes for table `Medicine`
--
ALTER TABLE `Medicine`
  ADD PRIMARY KEY (`medicineid`),
  ADD KEY `genericid` (`genericid`);

--
-- Indexes for table `Patient`
--
ALTER TABLE `Patient`
  ADD PRIMARY KEY (`patientid`),
  ADD KEY `insuranceid` (`insuranceid`);

--
-- Indexes for table `Payment`
--
ALTER TABLE `Payment`
  ADD PRIMARY KEY (`paymentid`),
  ADD KEY `admissionid` (`admissionid`),
  ADD KEY `insuranceid` (`insuranceid`);

--
-- Indexes for table `Prescription`
--
ALTER TABLE `Prescription`
  ADD PRIMARY KEY (`prescriptionid`),
  ADD KEY `admissionid` (`admissionid`),
  ADD KEY `medicineid` (`medicineid`),
  ADD KEY `doctorid` (`doctorid`);

--
-- Indexes for table `Role`
--
ALTER TABLE `Role`
  ADD PRIMARY KEY (`roleid`),
  ADD UNIQUE KEY `name` (`name`);

--
-- Indexes for table `Room`
--
ALTER TABLE `Room`
  ADD PRIMARY KEY (`room_no`),
  ADD KEY `categoryid` (`categoryid`),
  ADD KEY `floorid` (`floorid`);

--
-- Indexes for table `Room_Assignment`
--
ALTER TABLE `Room_Assignment`
  ADD PRIMARY KEY (`assignmentid`),
  ADD KEY `admissionid` (`admissionid`),
  ADD KEY `room_no` (`room_no`);

--
-- Indexes for table `Room_Category`
--
ALTER TABLE `Room_Category`
  ADD PRIMARY KEY (`categoryid`),
  ADD UNIQUE KEY `name` (`name`);

--
-- Indexes for table `Specialty`
--
ALTER TABLE `Specialty`
  ADD PRIMARY KEY (`specialtyid`),
  ADD UNIQUE KEY `name` (`name`);

--
-- Indexes for table `User`
--
ALTER TABLE `User`
  ADD PRIMARY KEY (`userid`),
  ADD KEY `roleid` (`roleid`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `Admission`
--
ALTER TABLE `Admission`
  MODIFY `admissionid` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `Billing`
--
ALTER TABLE `Billing`
  MODIFY `billingid` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `Billing_Category`
--
ALTER TABLE `Billing_Category`
  MODIFY `billing_categoryid` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `Doctor`
--
ALTER TABLE `Doctor`
  MODIFY `doctorid` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `Doctor_Assignment`
--
ALTER TABLE `Doctor_Assignment`
  MODIFY `assignmentid` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `Floor`
--
ALTER TABLE `Floor`
  MODIFY `floorid` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `Generic_Medicine`
--
ALTER TABLE `Generic_Medicine`
  MODIFY `genericid` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `Insurance_Provider`
--
ALTER TABLE `Insurance_Provider`
  MODIFY `insuranceid` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `Lab_Request`
--
ALTER TABLE `Lab_Request`
  MODIFY `lab_requestid` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `Lab_Test`
--
ALTER TABLE `Lab_Test`
  MODIFY `testid` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `Lab_Test_Category`
--
ALTER TABLE `Lab_Test_Category`
  MODIFY `labtestcatid` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `Medicine`
--
ALTER TABLE `Medicine`
  MODIFY `medicineid` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `Patient`
--
ALTER TABLE `Patient`
  MODIFY `patientid` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `Payment`
--
ALTER TABLE `Payment`
  MODIFY `paymentid` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `Prescription`
--
ALTER TABLE `Prescription`
  MODIFY `prescriptionid` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `Role`
--
ALTER TABLE `Role`
  MODIFY `roleid` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `Room_Assignment`
--
ALTER TABLE `Room_Assignment`
  MODIFY `assignmentid` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `Room_Category`
--
ALTER TABLE `Room_Category`
  MODIFY `categoryid` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `Specialty`
--
ALTER TABLE `Specialty`
  MODIFY `specialtyid` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `User`
--
ALTER TABLE `User`
  MODIFY `userid` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
