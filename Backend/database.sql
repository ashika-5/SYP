-- ============================================================
-- MEDICARE HOSPITAL APPOINTMENT SYSTEM
-- MySQL Database Setup
-- Run this file first before starting the backend
-- ============================================================

-- Create database
CREATE DATABASE IF NOT EXISTS medicare_db;
USE medicare_db;

-- ============================================================
-- TABLE 1: patients (users who book appointments)
-- ============================================================
CREATE TABLE IF NOT EXISTS patients (
  id INT AUTO_INCREMENT PRIMARY KEY,
  full_name VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  phone VARCHAR(15) NOT NULL,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ============================================================
-- TABLE 2: admins
-- ============================================================
CREATE TABLE IF NOT EXISTS admins (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- TABLE 3: hospitals
-- ============================================================
CREATE TABLE IF NOT EXISTS hospitals (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  location VARCHAR(100) NOT NULL,
  contact VARCHAR(20) DEFAULT 'N/A',
  specialties TEXT DEFAULT '',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ============================================================
-- TABLE 4: doctors
-- ============================================================
CREATE TABLE IF NOT EXISTS doctors (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  specialty VARCHAR(100) NOT NULL,
  hospital_id INT,
  experience VARCHAR(50) DEFAULT 'N/A',
  qualification VARCHAR(200) DEFAULT 'N/A',
  availability VARCHAR(150) DEFAULT 'N/A',
  bio TEXT DEFAULT '',
  image VARCHAR(255) DEFAULT '',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (hospital_id) REFERENCES hospitals(id) ON DELETE SET NULL
);

-- ============================================================
-- TABLE 5: appointments
-- ============================================================
CREATE TABLE IF NOT EXISTS appointments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  patient_id INT,
  doctor_id INT,
  patient_name VARCHAR(100) NOT NULL,
  patient_email VARCHAR(100),
  patient_phone VARCHAR(15),
  patient_age INT,
  doctor_name VARCHAR(100),
  hospital_name VARCHAR(150),
  preferred_time VARCHAR(20) NOT NULL,
  appointment_date DATE,
  status ENUM('Scheduled', 'Completed', 'Cancelled') DEFAULT 'Scheduled',
  amount INT DEFAULT 500,
  payment_method VARCHAR(50) DEFAULT 'eSewa',
  transaction_id VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE SET NULL,
  FOREIGN KEY (doctor_id) REFERENCES doctors(id) ON DELETE SET NULL
);

-- ============================================================
-- SEED DATA: Default admin account
-- Password: admin123 (bcrypt hashed)
-- ============================================================
INSERT IGNORE INTO admins (name, email, password) VALUES (
  'Administrator',
  'admin@medicare.com',
  '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy'
);

-- ============================================================
-- SEED DATA: Hospitals
-- ============================================================
INSERT IGNORE INTO hospitals (id, name, location, contact, specialties) VALUES
(1, 'Dharan Health Clinic', 'Dharan', '01-6678899', 'Internal Medicine,Urology,Physiotherapy'),
(2, 'Carewell Medical Hospital', 'Itahari', '01-7894567', 'Gynecology,Oncology,General Surgery'),
(3, 'City Care Hospital', 'Kathmandu', '01-5551234', 'Cardiology,Neurology,Pediatrics'),
(4, 'Green Valley Medical Center', 'Pokhara', '061-456789', 'Orthopedics,Dermatology,ENT'),
(5, 'Sunrise Hospital', 'Lalitpur', '01-7894567', 'Gynecology,Oncology,General Surgery'),
(6, 'Himalayan Health Clinic', 'Bhaktapur', '01-6678899', 'Internal Medicine,Urology,Physiotherapy'),
(7, 'Global Health Clinic', 'Bhaktapur', '01-6678899', 'Orthopedics,Dermatology,ENT'),
(8, 'Noble Health Clinic', 'Pokhara', '01-6678899', 'Internal Medicine,Urology,Physiotherapy'),
(9, 'Trusted Hand Hospital', 'Dharan', '01-7894567', 'Gynecology,Oncology,General Surgery');

-- ============================================================
-- SEED DATA: Doctors
-- ============================================================
INSERT IGNORE INTO doctors (id, name, specialty, hospital_id, experience, qualification, availability, bio, image) VALUES
(101, 'Dr. Mohit Kumar Karki', 'Internal Medicine', 1, '10 years', 'MBBS, MD Internal Medicine', 'Mon–Sat 9:00 AM – 5:00 PM', 'Special interest in diabetes, hypertension and preventive medicine.', '/images/doctors/doc3.jpg'),
(102, 'Dr. Maya Thapa', 'Urology', 1, '7 years', 'BPT, MPT Orthopedics', 'Tue–Fri 10:00 AM – 4:00 PM', 'Focus on musculoskeletal injuries and post-operative rehabilitation.', '/images/doctors/doc1.jpg'),
(103, 'Dr. Sushila Thapa', 'Physiotherapy', 1, '7 years', 'BPT, MPT Orthopedics', 'Tue–Fri 10:00 AM – 4:00 PM', 'Focus on musculoskeletal injuries and post-operative rehabilitation.', '/images/doctors/doc2.jpg'),
(201, 'Dr. Anita Limbu', 'Gynecology', 2, '12 years', 'MBBS, MS Obstetrics & Gynecology', 'Mon–Fri 8:00 AM – 3:00 PM', 'Experienced in high-risk pregnancy and laparoscopic procedures.', '/images/doctors/doc4.jpg'),
(202, 'Dr. Bikesh Khadka', 'Oncology', 2, '12 years', 'MBBS, MS Obstetrics & Gynecology', 'Mon–Fri 8:00 AM – 3:00 PM', 'Experienced in high-risk pregnancy and laparoscopic procedures.', '/images/doctors/doc5.jpg'),
(203, 'Dr. Prakash Sharma', 'General Surgery', 2, '12 years', 'MBBS, MS Obstetrics & Gynecology', 'Mon–Fri 8:00 AM – 3:00 PM', 'Experienced in high-risk pregnancy and laparoscopic procedures.', '/images/doctors/doc6.jpg'),
(301, 'Dr. Rajesh Sharma', 'Cardiology', 3, '14 years', 'MBBS, MD Cardiology, DM', 'Mon–Fri 8:00 AM – 4:00 PM', 'Interventional cardiologist with expertise in angiography and heart failure management.', '/images/doctors/doc7.jpg'),
(302, 'Dr. Sarita Gurung', 'Neurology', 3, '11 years', 'MBBS, MD Neurology', 'Tue–Sat 9:00 AM – 5:00 PM', 'Specializes in stroke, epilepsy, headache disorders and movement disorders.', '/images/doctors/doc8.webp'),
(303, 'Dr. Anjali Shrestha', 'Pediatrics', 3, '9 years', 'MBBS, MD Pediatrics', 'Mon–Sat 10:00 AM – 6:00 PM', 'Child health specialist focused on growth, vaccination and respiratory illnesses.', '/images/doctors/doc9.jpg'),
(401, 'Dr. Bikram Singh', 'Orthopedics', 4, '13 years', 'MBBS, MS Orthopedics', 'Mon–Fri 9:00 AM – 5:00 PM', 'Joint replacement and trauma surgeon with special interest in arthroscopy.', '/images/doctors/doc10.jpg'),
(402, 'Dr. Nisha Pokhrel', 'Dermatology', 4, '8 years', 'MBBS, MD Dermatology', 'Tue–Sat 10:00 AM – 4:00 PM', 'Expert in acne, psoriasis, laser treatments and cosmetic dermatology.', '/images/doctors/doc11.jpg'),
(403, 'Dr. Ramesh Adhikari', 'ENT', 4, '10 years', 'MBBS, MS ENT', 'Mon–Thu 8:30 AM – 3:30 PM', 'Specializes in sinus surgery, hearing loss and voice disorders.', '/images/doctors/doc12.jpg'),
(501, 'Dr. Rekha Basnet', 'Gynecology', 5, '15 years', 'MBBS, MD Gynecology & Obstetrics', 'Mon–Sat 9:00 AM – 4:00 PM', 'Experienced in laparoscopic gynecological surgeries and infertility.', '/images/doctors/doc13.jpg'),
(502, 'Dr. Arun Khadka', 'Oncology', 5, '12 years', 'MBBS, MD Medical Oncology', 'Mon–Fri 10:00 AM – 5:00 PM', 'Specializes in chemotherapy and cancer palliative care.', '/images/doctors/doc14.jpg'),
(503, 'Dr. Suresh Tamang', 'General Surgery', 5, '11 years', 'MBBS, MS General Surgery', 'Mon–Sat 8:00 AM – 4:00 PM', 'Laparoscopic and gastrointestinal surgeon.', '/images/doctors/doc15.jpg'),
(601, 'Dr. Binod Paudel', 'Internal Medicine', 6, '9 years', 'MBBS, MD Internal Medicine', 'Mon–Fri 9:00 AM – 5:00 PM', 'Management of thyroid disorders, infectious diseases and lifestyle diseases.', '/images/doctors/doc16.jpg'),
(602, 'Dr. Krishna Bahadur', 'Urology', 6, '10 years', 'MBBS, MS Urology', 'Tue–Sat 9:30 AM – 4:00 PM', 'Expert in kidney stones, prostate and urinary tract disorders.', '/images/doctors/doc17.jpg'),
(603, 'Dr. Puja Limbu', 'Physiotherapy', 6, '6 years', 'BPT, MPT', 'Mon–Sat 10:00 AM – 6:00 PM', 'Specialized in neuro and orthopedic rehabilitation.', '/images/doctors/doc18.jpg'),
(701, 'Dr. Dipak Rai', 'Orthopedics', 7, '12 years', 'MBBS, MS Orthopedics', 'Mon–Fri 9:00 AM – 5:00 PM', 'Trauma and spine surgery specialist.', '/images/doctors/doc19.jpg'),
(702, 'Dr. Sunita Karki', 'Dermatology', 7, '8 years', 'MBBS, MD Dermatology', 'Wed–Sun 10:00 AM – 4:00 PM', 'Hair and cosmetic skin treatments specialist.', '/images/doctors/doc20.jpg'),
(703, 'Dr. Prabina Karki', 'ENT', 7, '5 years', 'MBBS, ENT', 'Wed–Sun 10:00 AM – 4:00 PM', 'Specializes in sinus surgery, hearing loss and voice disorders.', '/images/doctors/doc21.jpg'),
(801, 'Dr. Hemant Joshi', 'Internal Medicine', 8, '11 years', 'MBBS, MD Internal Medicine', 'Mon–Sat 9:00 AM – 5:00 PM', 'Expert in geriatric medicine and critical care.', '/images/doctors/doc22.jpg'),
(802, 'Dr. Rina Shrestha', 'Physiotherapy', 8, '7 years', 'BPT, MPT Sports', 'Mon–Fri 10:00 AM – 6:00 PM', 'Sports injury and post-fracture rehabilitation.', '/images/doctors/doc23.jpg'),
(803, 'Dr. Puskar Shrestha', 'Physiotherapy', 8, '9 years', 'BPT, MPT Sports', 'Mon–Fri 10:00 AM – 6:00 PM', 'Sports injury and post-fracture rehabilitation.', '/images/doctors/doc24.jpg'),
(901, 'Dr. Sabina Thapa', 'Gynecology', 9, '13 years', 'MBBS, MD Gynecology', 'Mon–Sat 8:30 AM – 4:30 PM', 'High-risk pregnancy and gynecological oncology.', '/images/doctors/doc25.jpg'),
(902, 'Dr. Prakash Gurung', 'Oncology', 9, '10 years', 'MBBS, MD Oncology', 'Mon–Fri 9:00 AM – 5:00 PM', 'Laparoscopic hernia and gallbladder surgery expert.', '/images/doctors/doc26.jpg'),
(903, 'Dr. Hemanta Shrestha', 'General Surgery', 9, '10 years', 'MBBS, MS General Surgery', 'Mon–Fri 9:00 AM – 5:00 PM', 'Laparoscopic hernia and gallbladder surgery expert.', '/images/doctors/doc27.jpg');