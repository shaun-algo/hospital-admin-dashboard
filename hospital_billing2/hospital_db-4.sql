        -- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Aug 15, 2025 at 01:07 PM
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
  `room_no` varchar(20) DEFAULT NULL,
  `admission_date` datetime DEFAULT NULL,
  `status` varchar(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `Billing`
--

CREATE TABLE `Billing` (
  `billingid` int(11) NOT NULL,
  `admissionid` int(11) DEFAULT NULL,
  `billing_categoryid` int(11) DEFAULT NULL,
  `lab_billid` int(11) DEFAULT NULL,
  `med_billid` int(11) DEFAULT NULL,
  `room_billid` int(11) DEFAULT NULL,
  `pf_billid` int(11) DEFAULT NULL,
  `billing_date` datetime DEFAULT NULL,
  `amount` decimal(10,2) DEFAULT NULL,
  `status` varchar(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `Billing_Category`
--

CREATE TABLE `Billing_Category` (
  `billing_categoryid` int(11) NOT NULL,
  `name` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `Doctor`
--

CREATE TABLE `Doctor` (
  `doctorid` int(11) NOT NULL,
  `fullname` varchar(100) DEFAULT NULL,
  `specialty` varchar(100) DEFAULT NULL,
  `contact_no` varchar(20) DEFAULT NULL,
  `status` varchar(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `Doctor`
--

INSERT INTO `Doctor` (`doctorid`, `fullname`, `specialty`, `contact_no`, `status`) VALUES
(33, 'SHAUNU MICHAEL T BELONO-AC', 'Cardiology', '09361470082', 'Active'),
(42, 'Kulas D. Malas', 'Pulmonology', '092367348837', 'Suspended'),
(43, 'Ce jay Luzon', 'test', '02934', 'Active');

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
-- Table structure for table `Lab_Billing`
--

CREATE TABLE `Lab_Billing` (
  `lab_billid` int(11) NOT NULL,
  `admissionid` int(11) DEFAULT NULL,
  `testid` int(11) DEFAULT NULL,
  `amount` decimal(10,2) DEFAULT NULL,
  `time` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `Lab_request`
--

CREATE TABLE `Lab_request` (
  `lab_requestid` int(11) NOT NULL,
  `admissionid` int(11) DEFAULT NULL,
  `requestedBy` int(11) DEFAULT NULL,
  `testid` int(11) DEFAULT NULL,
  `status` varchar(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `Lab_test`
--

CREATE TABLE `Lab_test` (
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
  `handling_fee` decimal(10,2) DEFAULT NULL,
  `turnaround_days` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `Medicine`
--

CREATE TABLE `Medicine` (
  `medicineid` int(11) NOT NULL,
  `name` varchar(100) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `price` decimal(10,2) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `Medicine_Billing`
--

CREATE TABLE `Medicine_Billing` (
  `med_billid` int(11) NOT NULL,
  `admissionid` int(11) DEFAULT NULL,
  `medicineid` int(11) DEFAULT NULL,
  `quantity` int(11) DEFAULT NULL,
  `amount` decimal(10,2) DEFAULT NULL,
  `time` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `Membership_Coverage`
--

CREATE TABLE `Membership_Coverage` (
  `coverageid` int(11) NOT NULL,
  `providerid` int(11) DEFAULT NULL,
  `billing_categoryid` int(11) DEFAULT NULL,
  `coverage_percent` decimal(5,2) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `Membership_Provider`
--

CREATE TABLE `Membership_Provider` (
  `providerid` int(11) NOT NULL,
  `name` varchar(100) DEFAULT NULL,
  `description` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `Patient`
--

CREATE TABLE `Patient` (
  `patientid` int(11) NOT NULL,
  `fullname` varchar(100) DEFAULT NULL,
  `gender` varchar(10) DEFAULT NULL,
  `contact_no` varchar(20) DEFAULT NULL,
  `address` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `Patient`
--

INSERT INTO `Patient` (`patientid`, `fullname`, `gender`, `contact_no`, `address`) VALUES
(1, 'Shaun Michael', 'Other', '03495453', 'East');

-- --------------------------------------------------------

--
-- Table structure for table `Patient_Membership`
--

CREATE TABLE `Patient_Membership` (
  `membershipid` int(11) NOT NULL,
  `patientid` int(11) DEFAULT NULL,
  `providerid` int(11) DEFAULT NULL,
  `membership_no` varchar(50) DEFAULT NULL,
  `start_date` date DEFAULT NULL,
  `end_date` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `Payment`
--

CREATE TABLE `Payment` (
  `paymentid` int(11) NOT NULL,
  `admissionid` int(11) DEFAULT NULL,
  `amount` decimal(10,2) DEFAULT NULL,
  `date` datetime DEFAULT NULL,
  `method` varchar(50) DEFAULT NULL,
  `remarks` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `PF_Billing`
--

CREATE TABLE `PF_Billing` (
  `pf_billid` int(11) NOT NULL,
  `admissionid` int(11) DEFAULT NULL,
  `doctorid` int(11) DEFAULT NULL,
  `role` varchar(50) DEFAULT NULL,
  `amount` decimal(10,2) DEFAULT NULL,
  `time` datetime DEFAULT NULL
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
  `status` varchar(20) DEFAULT NULL,
  `prescription_date` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `Role`
--

CREATE TABLE `Role` (
  `roleid` int(11) NOT NULL,
  `name` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `Role`
--

INSERT INTO `Role` (`roleid`, `name`) VALUES
(1, 'Admin'),
(2, 'Doctor'),
(3, 'Nurse'),
(4, 'Cashier'),
(5, 'Laboratory Staff'),
(6, 'Pharmacist'),
(7, 'Billing Officer');

-- --------------------------------------------------------

--
-- Table structure for table `Room`
--

CREATE TABLE `Room` (
  `room_no` varchar(20) NOT NULL,
  `categoryid` int(11) DEFAULT NULL,
  `floor` int(11) DEFAULT NULL,
  `status` varchar(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `Room_Billing`
--

CREATE TABLE `Room_Billing` (
  `room_billid` int(11) NOT NULL,
  `admissionid` int(11) DEFAULT NULL,
  `room_no` varchar(20) DEFAULT NULL,
  `number_of_days` int(11) DEFAULT NULL,
  `rate_per_day` decimal(10,2) DEFAULT NULL,
  `total_amount` decimal(10,2) DEFAULT NULL,
  `time` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `Room_Category`
--

CREATE TABLE `Room_Category` (
  `categoryid` int(11) NOT NULL,
  `name` varchar(50) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `rate_per_day` decimal(10,2) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

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
(1, 1, 'admin', 'admin123', 'active');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `Admission`
--
ALTER TABLE `Admission`
  ADD PRIMARY KEY (`admissionid`),
  ADD KEY `patientid` (`patientid`),
  ADD KEY `userid` (`userid`),
  ADD KEY `room_no` (`room_no`);

--
-- Indexes for table `Billing`
--
ALTER TABLE `Billing`
  ADD PRIMARY KEY (`billingid`),
  ADD KEY `admissionid` (`admissionid`),
  ADD KEY `billing_categoryid` (`billing_categoryid`),
  ADD KEY `lab_billid` (`lab_billid`),
  ADD KEY `med_billid` (`med_billid`),
  ADD KEY `room_billid` (`room_billid`),
  ADD KEY `pf_billid` (`pf_billid`);

--
-- Indexes for table `Billing_Category`
--
ALTER TABLE `Billing_Category`
  ADD PRIMARY KEY (`billing_categoryid`);

--
-- Indexes for table `Doctor`
--
ALTER TABLE `Doctor`
  ADD PRIMARY KEY (`doctorid`);

--
-- Indexes for table `Doctor_Assignment`
--
ALTER TABLE `Doctor_Assignment`
  ADD PRIMARY KEY (`assignmentid`),
  ADD KEY `admissionid` (`admissionid`),
  ADD KEY `doctorid` (`doctorid`);

--
-- Indexes for table `Lab_Billing`
--
ALTER TABLE `Lab_Billing`
  ADD PRIMARY KEY (`lab_billid`),
  ADD KEY `admissionid` (`admissionid`),
  ADD KEY `testid` (`testid`);

--
-- Indexes for table `Lab_request`
--
ALTER TABLE `Lab_request`
  ADD PRIMARY KEY (`lab_requestid`),
  ADD KEY `admissionid` (`admissionid`),
  ADD KEY `requestedBy` (`requestedBy`),
  ADD KEY `testid` (`testid`);

--
-- Indexes for table `Lab_test`
--
ALTER TABLE `Lab_test`
  ADD PRIMARY KEY (`testid`),
  ADD KEY `categoryid` (`categoryid`);

--
-- Indexes for table `Lab_Test_Category`
--
ALTER TABLE `Lab_Test_Category`
  ADD PRIMARY KEY (`labtestcatid`);

--
-- Indexes for table `Medicine`
--
ALTER TABLE `Medicine`
  ADD PRIMARY KEY (`medicineid`);

--
-- Indexes for table `Medicine_Billing`
--
ALTER TABLE `Medicine_Billing`
  ADD PRIMARY KEY (`med_billid`),
  ADD KEY `admissionid` (`admissionid`),
  ADD KEY `medicineid` (`medicineid`);

--
-- Indexes for table `Membership_Coverage`
--
ALTER TABLE `Membership_Coverage`
  ADD PRIMARY KEY (`coverageid`),
  ADD KEY `providerid` (`providerid`),
  ADD KEY `billing_categoryid` (`billing_categoryid`);

--
-- Indexes for table `Membership_Provider`
--
ALTER TABLE `Membership_Provider`
  ADD PRIMARY KEY (`providerid`);

--
-- Indexes for table `Patient`
--
ALTER TABLE `Patient`
  ADD PRIMARY KEY (`patientid`);

--
-- Indexes for table `Patient_Membership`
--
ALTER TABLE `Patient_Membership`
  ADD PRIMARY KEY (`membershipid`),
  ADD KEY `patientid` (`patientid`),
  ADD KEY `providerid` (`providerid`);

--
-- Indexes for table `Payment`
--
ALTER TABLE `Payment`
  ADD PRIMARY KEY (`paymentid`),
  ADD KEY `admissionid` (`admissionid`);

--
-- Indexes for table `PF_Billing`
--
ALTER TABLE `PF_Billing`
  ADD PRIMARY KEY (`pf_billid`),
  ADD KEY `admissionid` (`admissionid`),
  ADD KEY `doctorid` (`doctorid`);

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
  ADD PRIMARY KEY (`roleid`);

--
-- Indexes for table `Room`
--
ALTER TABLE `Room`
  ADD PRIMARY KEY (`room_no`),
  ADD KEY `categoryid` (`categoryid`);

--
-- Indexes for table `Room_Billing`
--
ALTER TABLE `Room_Billing`
  ADD PRIMARY KEY (`room_billid`),
  ADD KEY `admissionid` (`admissionid`),
  ADD KEY `room_no` (`room_no`);

--
-- Indexes for table `Room_Category`
--
ALTER TABLE `Room_Category`
  ADD PRIMARY KEY (`categoryid`);

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
  MODIFY `doctorid` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=44;

--
-- AUTO_INCREMENT for table `Doctor_Assignment`
--
ALTER TABLE `Doctor_Assignment`
  MODIFY `assignmentid` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `Lab_Billing`
--
ALTER TABLE `Lab_Billing`
  MODIFY `lab_billid` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `Lab_request`
--
ALTER TABLE `Lab_request`
  MODIFY `lab_requestid` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `Lab_test`
--
ALTER TABLE `Lab_test`
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
-- AUTO_INCREMENT for table `Medicine_Billing`
--
ALTER TABLE `Medicine_Billing`
  MODIFY `med_billid` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `Membership_Coverage`
--
ALTER TABLE `Membership_Coverage`
  MODIFY `coverageid` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `Membership_Provider`
--
ALTER TABLE `Membership_Provider`
  MODIFY `providerid` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `Patient`
--
ALTER TABLE `Patient`
  MODIFY `patientid` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `Patient_Membership`
--
ALTER TABLE `Patient_Membership`
  MODIFY `membershipid` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `Payment`
--
ALTER TABLE `Payment`
  MODIFY `paymentid` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `PF_Billing`
--
ALTER TABLE `PF_Billing`
  MODIFY `pf_billid` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `Prescription`
--
ALTER TABLE `Prescription`
  MODIFY `prescriptionid` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `Role`
--
ALTER TABLE `Role`
  MODIFY `roleid` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `Room_Billing`
--
ALTER TABLE `Room_Billing`
  MODIFY `room_billid` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `Room_Category`
--
ALTER TABLE `Room_Category`
  MODIFY `categoryid` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `User`
--
ALTER TABLE `User`
  MODIFY `userid` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `Admission`
--
ALTER TABLE `Admission`
  ADD CONSTRAINT `admission_ibfk_1` FOREIGN KEY (`patientid`) REFERENCES `Patient` (`patientid`),
  ADD CONSTRAINT `admission_ibfk_2` FOREIGN KEY (`userid`) REFERENCES `User` (`userid`),
  ADD CONSTRAINT `admission_ibfk_3` FOREIGN KEY (`room_no`) REFERENCES `Room` (`room_no`);

--
-- Constraints for table `Billing`
--
ALTER TABLE `Billing`
  ADD CONSTRAINT `billing_ibfk_1` FOREIGN KEY (`admissionid`) REFERENCES `Admission` (`admissionid`),
  ADD CONSTRAINT `billing_ibfk_2` FOREIGN KEY (`billing_categoryid`) REFERENCES `Billing_Category` (`billing_categoryid`),
  ADD CONSTRAINT `billing_ibfk_3` FOREIGN KEY (`lab_billid`) REFERENCES `Lab_Billing` (`lab_billid`),
  ADD CONSTRAINT `billing_ibfk_4` FOREIGN KEY (`med_billid`) REFERENCES `Medicine_Billing` (`med_billid`),
  ADD CONSTRAINT `billing_ibfk_5` FOREIGN KEY (`room_billid`) REFERENCES `Room_Billing` (`room_billid`),
  ADD CONSTRAINT `billing_ibfk_6` FOREIGN KEY (`pf_billid`) REFERENCES `PF_Billing` (`pf_billid`);

--
-- Constraints for table `Doctor_Assignment`
--
ALTER TABLE `Doctor_Assignment`
  ADD CONSTRAINT `doctor_assignment_ibfk_1` FOREIGN KEY (`admissionid`) REFERENCES `Admission` (`admissionid`),
  ADD CONSTRAINT `doctor_assignment_ibfk_2` FOREIGN KEY (`doctorid`) REFERENCES `Doctor` (`doctorid`);

--
-- Constraints for table `Lab_Billing`
--
ALTER TABLE `Lab_Billing`
  ADD CONSTRAINT `lab_billing_ibfk_1` FOREIGN KEY (`admissionid`) REFERENCES `Admission` (`admissionid`),
  ADD CONSTRAINT `lab_billing_ibfk_2` FOREIGN KEY (`testid`) REFERENCES `Lab_test` (`testid`);

--
-- Constraints for table `Lab_request`
--
ALTER TABLE `Lab_request`
  ADD CONSTRAINT `lab_request_ibfk_1` FOREIGN KEY (`admissionid`) REFERENCES `Admission` (`admissionid`),
  ADD CONSTRAINT `lab_request_ibfk_2` FOREIGN KEY (`requestedBy`) REFERENCES `Doctor` (`doctorid`),
  ADD CONSTRAINT `lab_request_ibfk_3` FOREIGN KEY (`testid`) REFERENCES `Lab_test` (`testid`);

--
-- Constraints for table `Lab_test`
--
ALTER TABLE `Lab_test`
  ADD CONSTRAINT `lab_test_ibfk_1` FOREIGN KEY (`categoryid`) REFERENCES `Lab_Test_Category` (`labtestcatid`);

--
-- Constraints for table `Medicine_Billing`
--
ALTER TABLE `Medicine_Billing`
  ADD CONSTRAINT `medicine_billing_ibfk_1` FOREIGN KEY (`admissionid`) REFERENCES `Admission` (`admissionid`),
  ADD CONSTRAINT `medicine_billing_ibfk_2` FOREIGN KEY (`medicineid`) REFERENCES `Medicine` (`medicineid`);

--
-- Constraints for table `Membership_Coverage`
--
ALTER TABLE `Membership_Coverage`
  ADD CONSTRAINT `membership_coverage_ibfk_1` FOREIGN KEY (`providerid`) REFERENCES `Membership_Provider` (`providerid`),
  ADD CONSTRAINT `membership_coverage_ibfk_2` FOREIGN KEY (`billing_categoryid`) REFERENCES `Billing_Category` (`billing_categoryid`);

--
-- Constraints for table `Patient_Membership`
--
ALTER TABLE `Patient_Membership`
  ADD CONSTRAINT `patient_membership_ibfk_1` FOREIGN KEY (`patientid`) REFERENCES `Patient` (`patientid`),
  ADD CONSTRAINT `patient_membership_ibfk_2` FOREIGN KEY (`providerid`) REFERENCES `Membership_Provider` (`providerid`);

--
-- Constraints for table `Payment`
--
ALTER TABLE `Payment`
  ADD CONSTRAINT `payment_ibfk_1` FOREIGN KEY (`admissionid`) REFERENCES `Admission` (`admissionid`);

--
-- Constraints for table `PF_Billing`
--
ALTER TABLE `PF_Billing`
  ADD CONSTRAINT `pf_billing_ibfk_1` FOREIGN KEY (`admissionid`) REFERENCES `Admission` (`admissionid`),
  ADD CONSTRAINT `pf_billing_ibfk_2` FOREIGN KEY (`doctorid`) REFERENCES `Doctor` (`doctorid`);

--
-- Constraints for table `Prescription`
--
ALTER TABLE `Prescription`
  ADD CONSTRAINT `prescription_ibfk_1` FOREIGN KEY (`admissionid`) REFERENCES `Admission` (`admissionid`),
  ADD CONSTRAINT `prescription_ibfk_2` FOREIGN KEY (`medicineid`) REFERENCES `Medicine` (`medicineid`),
  ADD CONSTRAINT `prescription_ibfk_3` FOREIGN KEY (`doctorid`) REFERENCES `Doctor` (`doctorid`);

--
-- Constraints for table `Room`
--
ALTER TABLE `Room`
  ADD CONSTRAINT `room_ibfk_1` FOREIGN KEY (`categoryid`) REFERENCES `Room_Category` (`categoryid`);

--
-- Constraints for table `Room_Billing`
--
ALTER TABLE `Room_Billing`
  ADD CONSTRAINT `room_billing_ibfk_1` FOREIGN KEY (`admissionid`) REFERENCES `Admission` (`admissionid`),
  ADD CONSTRAINT `room_billing_ibfk_2` FOREIGN KEY (`room_no`) REFERENCES `Room` (`room_no`);

--
-- Constraints for table `User`
--
ALTER TABLE `User`
  ADD CONSTRAINT `user_ibfk_1` FOREIGN KEY (`roleid`) REFERENCES `Role` (`roleid`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
