-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Aug 23, 2025 at 08:21 AM
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
(1, 'Dr. John Smith', 1, '123-456-7890', 'Active'),
(3, 'test', 6, '09234324', 'Active');

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
(1, 'g', 0),
(2, 'Ground Floor', 0),
(3, 'First Floor', 0),
(4, 'Second Floor', 0),
(5, 'test', 0);

-- --------------------------------------------------------

--
-- Table structure for table `Generic_Medicine`
--

CREATE TABLE `Generic_Medicine` (
  `genericid` int(11) NOT NULL,
  `generic_name` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `Generic_Medicine`
--

INSERT INTO `Generic_Medicine` (`genericid`, `generic_name`) VALUES
(1, 'gf');

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
(1, 'test', 70.00, 'test', 1);

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
('201', 3, 2, 'Available'),
('202', 2, 2, 'Available'),
('301', 1, 3, 'Available');

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
(1, 'General Ward', 'Shared room with multiple beds', 100.00, 1),
(2, 'Private Room', 'Single occupancy with comfort amenities', 250.00, 1),
(3, 'ICU', 'Intensive Care Unit with critical care equipment', 500.00, 1);

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
(5, 'Dermatology'),
(2, 'Neurology'),
(4, 'Orthopedics'),
(3, 'Pediatrics'),
(6, 'test');

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
-- Indexes for dumped tables
--

--
-- Indexes for table `Admission`
--
ALTER TABLE `Admission`
  ADD PRIMARY KEY (`admissionid`),
  ADD KEY `patientid` (`patientid`),
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
  MODIFY `billing_categoryid` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `Doctor`
--
ALTER TABLE `Doctor`
  MODIFY `doctorid` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `Doctor_Assignment`
--
ALTER TABLE `Doctor_Assignment`
  MODIFY `assignmentid` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `Floor`
--
ALTER TABLE `Floor`
  MODIFY `floorid` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `Generic_Medicine`
--
ALTER TABLE `Generic_Medicine`
  MODIFY `genericid` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `Insurance_Provider`
--
ALTER TABLE `Insurance_Provider`
  MODIFY `insuranceid` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `Lab_Request`
--
ALTER TABLE `Lab_Request`
  MODIFY `lab_requestid` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `Lab_Test`
--
ALTER TABLE `Lab_Test`
  MODIFY `testid` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `Lab_Test_Category`
--
ALTER TABLE `Lab_Test_Category`
  MODIFY `labtestcatid` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `Medicine`
--
ALTER TABLE `Medicine`
  MODIFY `medicineid` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `Patient`
--
ALTER TABLE `Patient`
  MODIFY `patientid` int(11) NOT NULL AUTO_INCREMENT;

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
  MODIFY `roleid` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `Room_Assignment`
--
ALTER TABLE `Room_Assignment`
  MODIFY `assignmentid` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `Room_Category`
--
ALTER TABLE `Room_Category`
  MODIFY `categoryid` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `Specialty`
--
ALTER TABLE `Specialty`
  MODIFY `specialtyid` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `User`
--
ALTER TABLE `User`
  MODIFY `userid` int(11) NOT NULL AUTO_INCREMENT;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `Admission`
--
ALTER TABLE `Admission`
  ADD CONSTRAINT `fk_admission_patient` FOREIGN KEY (`patientid`) REFERENCES `Patient` (`patientid`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_admission_user` FOREIGN KEY (`userid`) REFERENCES `User` (`userid`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `Billing`
--
ALTER TABLE `Billing`
  ADD CONSTRAINT `fk_billing_admission` FOREIGN KEY (`admissionid`) REFERENCES `Admission` (`admissionid`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_billing_category` FOREIGN KEY (`billing_categoryid`) REFERENCES `Billing_Category` (`billing_categoryid`) ON UPDATE CASCADE;

--
-- Constraints for table `Doctor`
--
ALTER TABLE `Doctor`
  ADD CONSTRAINT `fk_doctor_specialty` FOREIGN KEY (`specialtyid`) REFERENCES `Specialty` (`specialtyid`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `Doctor_Assignment`
--
ALTER TABLE `Doctor_Assignment`
  ADD CONSTRAINT `fk_doc_assign_admission` FOREIGN KEY (`admissionid`) REFERENCES `Admission` (`admissionid`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_doc_assign_doctor` FOREIGN KEY (`doctorid`) REFERENCES `Doctor` (`doctorid`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `Lab_Request`
--
ALTER TABLE `Lab_Request`
  ADD CONSTRAINT `fk_labreq_admission` FOREIGN KEY (`admissionid`) REFERENCES `Admission` (`admissionid`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_labreq_doctor` FOREIGN KEY (`requestedBy`) REFERENCES `Doctor` (`doctorid`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_labreq_test` FOREIGN KEY (`testid`) REFERENCES `Lab_Test` (`testid`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `Lab_Test`
--
ALTER TABLE `Lab_Test`
  ADD CONSTRAINT `fk_labtest_category` FOREIGN KEY (`categoryid`) REFERENCES `Lab_Test_Category` (`labtestcatid`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `Medicine`
--
ALTER TABLE `Medicine`
  ADD CONSTRAINT `fk_medicine_generic` FOREIGN KEY (`genericid`) REFERENCES `Generic_Medicine` (`genericid`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `Patient`
--
ALTER TABLE `Patient`
  ADD CONSTRAINT `fk_patient_insurance` FOREIGN KEY (`insuranceid`) REFERENCES `Insurance_Provider` (`insuranceid`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `Payment`
--
ALTER TABLE `Payment`
  ADD CONSTRAINT `fk_payment_admission` FOREIGN KEY (`admissionid`) REFERENCES `Admission` (`admissionid`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_payment_insurance` FOREIGN KEY (`insuranceid`) REFERENCES `Insurance_Provider` (`insuranceid`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `Prescription`
--
ALTER TABLE `Prescription`
  ADD CONSTRAINT `fk_presc_admission` FOREIGN KEY (`admissionid`) REFERENCES `Admission` (`admissionid`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_presc_doctor` FOREIGN KEY (`doctorid`) REFERENCES `Doctor` (`doctorid`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_presc_medicine` FOREIGN KEY (`medicineid`) REFERENCES `Medicine` (`medicineid`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `Room`
--
ALTER TABLE `Room`
  ADD CONSTRAINT `fk_room_category` FOREIGN KEY (`categoryid`) REFERENCES `Room_Category` (`categoryid`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_room_floor` FOREIGN KEY (`floorid`) REFERENCES `Floor` (`floorid`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `Room_Assignment`
--
ALTER TABLE `Room_Assignment`
  ADD CONSTRAINT `fk_roomassign_admission` FOREIGN KEY (`admissionid`) REFERENCES `Admission` (`admissionid`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_roomassign_room` FOREIGN KEY (`room_no`) REFERENCES `Room` (`room_no`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `User`
--
ALTER TABLE `User`
  ADD CONSTRAINT `fk_user_role` FOREIGN KEY (`roleid`) REFERENCES `Role` (`roleid`) ON DELETE SET NULL ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
