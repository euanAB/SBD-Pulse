-- Sample data for Pulse Academy Portal
-- This script populates the database with realistic test data

-- Insert sample locations
INSERT INTO public.locations (location_id, name, address_line1, city, postcode, what3words, capacity, amenities, accessibility_features, parking_info, lease_start_date, lease_end_date, lease_cost, managing_agent, emergency_contact) VALUES
('LOC-001', 'Central Training Centre', '123 High Street', 'London', 'SW1A 1AA', 'filled.count.soap', 30, ARRAY['WiFi', 'Projector', 'Whiteboard', 'Air Conditioning'], ARRAY['Wheelchair Access', 'Disabled Parking', 'Hearing Loop'], 'Free parking available for 2 hours', '2024-01-01', '2026-12-31', 2500.00, 'Property Management Ltd', '+44 20 7946 0958'),
('LOC-002', 'North Campus', '456 Training Road', 'Manchester', 'M1 1AA', 'index.home.raft', 25, ARRAY['WiFi', 'Interactive Board', 'Kitchen Facilities'], ARRAY['Wheelchair Access', 'Lift Access'], 'On-site parking £5/day', '2024-06-01', '2027-05-31', 1800.00, 'Northern Properties', '+44 161 496 0123'),
('LOC-003', 'Community Learning Hub', '789 Education Avenue', 'Birmingham', 'B1 1AA', 'laptop.purple.spoon', 20, ARRAY['WiFi', 'Projector', 'Breakout Rooms'], ARRAY['Ground Floor Access'], 'Street parking only', '2023-09-01', '2025-08-31', 1200.00, 'Community Estates', '+44 121 496 0789');

-- Insert sample courses
INSERT INTO public.courses (course_id, title, description, category, level, duration_hours, max_students, min_students, price, certification_body, prerequisites, learning_outcomes, modules) VALUES
('CRS-001', 'Emergency First Aid at Work', 'Essential first aid skills for workplace emergencies', 'Health & Safety', 'beginner', 6, 12, 4, 85.00, 'Qualsafe Awards', ARRAY[], ARRAY['Assess emergency situations', 'Provide CPR', 'Treat wounds and bleeding', 'Manage unconscious casualties'], '{"module1": {"title": "Emergency Response", "duration": 2}, "module2": {"title": "CPR and AED", "duration": 2}, "module3": {"title": "Wound Care", "duration": 2}}'),
('CRS-002', 'Nail Technician Level 2', 'Professional nail care and enhancement techniques', 'Beauty Therapy', 'intermediate', 120, 8, 3, 1250.00, 'VTCT', ARRAY['Basic beauty knowledge'], ARRAY['Perform manicures and pedicures', 'Apply nail extensions', 'Create nail art designs', 'Maintain hygiene standards'], '{"module1": {"title": "Nail Anatomy", "duration": 20}, "module2": {"title": "Manicure Techniques", "duration": 30}, "module3": {"title": "Nail Extensions", "duration": 40}, "module4": {"title": "Nail Art", "duration": 30}}'),
('CRS-003', 'Food Safety Level 2', 'Comprehensive food safety and hygiene training', 'Food Safety', 'intermediate', 8, 15, 5, 65.00, 'Highfield Qualifications', ARRAY[], ARRAY['Understand food safety legislation', 'Implement HACCP principles', 'Prevent food contamination', 'Maintain food safety records'], '{"module1": {"title": "Food Safety Law", "duration": 2}, "module2": {"title": "Hazard Analysis", "duration": 3}, "module3": {"title": "Personal Hygiene", "duration": 2}, "module4": {"title": "Cleaning and Disinfection", "duration": 1}}');

-- Insert sample classes
INSERT INTO public.classes (class_id, course_id, location_id, title, start_date, end_date, start_time, end_time, max_students, price, status) VALUES
('CLS-2025-001', (SELECT id FROM public.courses WHERE course_id = 'CRS-001'), (SELECT id FROM public.locations WHERE location_id = 'LOC-001'), 'Emergency First Aid - January 2025', '2025-01-15', '2025-01-15', '09:00', '16:00', 12, 85.00, 'active'),
('CLS-2025-002', (SELECT id FROM public.courses WHERE course_id = 'CRS-002'), (SELECT id FROM public.locations WHERE location_id = 'LOC-002'), 'Nail Technician Course - February 2025', '2025-02-03', '2025-03-28', '10:00', '16:00', 8, 1250.00, 'active'),
('CLS-2025-003', (SELECT id FROM public.courses WHERE course_id = 'CRS-003'), (SELECT id FROM public.locations WHERE location_id = 'LOC-003'), 'Food Safety Training - March 2025', '2025-03-10', '2025-03-11', '09:30', '17:30', 15, 65.00, 'proposed');

-- Insert class sessions for the first aid course
INSERT INTO public.class_sessions (class_id, session_number, date, start_time, end_time, topic, description, status) VALUES
((SELECT id FROM public.classes WHERE class_id = 'CLS-2025-001'), 1, '2025-01-15', '09:00', '12:00', 'Emergency Response Fundamentals', 'Introduction to first aid and emergency assessment', 'scheduled'),
((SELECT id FROM public.classes WHERE class_id = 'CLS-2025-001'), 2, '2025-01-15', '13:00', '16:00', 'CPR and Practical Skills', 'Hands-on CPR training and wound care', 'scheduled');

-- Insert class sessions for nail technician course (8 sessions over 8 weeks)
INSERT INTO public.class_sessions (class_id, session_number, date, start_time, end_time, topic, description, status) VALUES
((SELECT id FROM public.classes WHERE class_id = 'CLS-2025-002'), 1, '2025-02-03', '10:00', '16:00', 'Nail Anatomy and Health', 'Understanding nail structure and common conditions', 'scheduled'),
((SELECT id FROM public.classes WHERE class_id = 'CLS-2025-002'), 2, '2025-02-10', '10:00', '16:00', 'Basic Manicure Techniques', 'Cuticle care and nail shaping', 'scheduled'),
((SELECT id FROM public.classes WHERE class_id = 'CLS-2025-002'), 3, '2025-02-17', '10:00', '16:00', 'Advanced Manicure Skills', 'Polish application and hand massage', 'scheduled'),
((SELECT id FROM public.classes WHERE class_id = 'CLS-2025-002'), 4, '2025-02-24', '10:00', '16:00', 'Pedicure Fundamentals', 'Foot care and pedicure techniques', 'scheduled'),
((SELECT id FROM public.classes WHERE class_id = 'CLS-2025-002'), 5, '2025-03-03', '10:00', '16:00', 'Nail Extension Basics', 'Acrylic and gel extension methods', 'scheduled'),
((SELECT id FROM public.classes WHERE class_id = 'CLS-2025-002'), 6, '2025-03-10', '10:00', '16:00', 'Advanced Extensions', 'Sculpting and overlay techniques', 'scheduled'),
((SELECT id FROM public.classes WHERE class_id = 'CLS-2025-002'), 7, '2025-03-17', '10:00', '16:00', 'Nail Art and Design', 'Creative techniques and client consultation', 'scheduled'),
((SELECT id FROM public.classes WHERE class_id = 'CLS-2025-002'), 8, '2025-03-24', '10:00', '16:00', 'Business Skills and Assessment', 'Client management and final practical assessment', 'scheduled');

-- Insert assessments for the first aid course
INSERT INTO public.assessments (class_id, name, description, type, weight_percentage, pass_rate, max_score) VALUES
((SELECT id FROM public.classes WHERE class_id = 'CLS-2025-001'), 'Practical Assessment', 'Hands-on demonstration of first aid techniques', 'practical', 40, 70, 100),
((SELECT id FROM public.classes WHERE class_id = 'CLS-2025-001'), 'Theory Assessment', 'Written test on first aid knowledge', 'theory', 30, 70, 100),
((SELECT id FROM public.classes WHERE class_id = 'CLS-2025-001'), 'Final Exam', 'Comprehensive final examination', 'final_exam', 30, 70, 100);

-- Insert assessments for nail technician course
INSERT INTO public.assessments (class_id, name, description, type, weight_percentage, pass_rate, max_score) VALUES
((SELECT id FROM public.classes WHERE class_id = 'CLS-2025-002'), 'Practical Portfolio', 'Collection of practical work throughout course', 'practical', 60, 70, 100),
((SELECT id FROM public.classes WHERE class_id = 'CLS-2025-002'), 'Theory Examination', 'Written examination on nail technology', 'theory', 25, 70, 100),
((SELECT id FROM public.classes WHERE class_id = 'CLS-2025-002'), 'Professional Skills Assessment', 'Client consultation and service delivery', 'practical', 15, 70, 100);

-- Insert sample notices
INSERT INTO public.notices (class_id, title, content, type, priority) VALUES
((SELECT id FROM public.classes WHERE class_id = 'CLS-2025-001'), 'Course Materials Required', 'Please bring a notepad and pen to the first session. All other materials will be provided.', 'info', 1),
((SELECT id FROM public.classes WHERE class_id = 'CLS-2025-001'), 'Parking Information', 'Free parking is available for 2 hours. Please display your student parking permit.', 'info', 2),
((SELECT id FROM public.classes WHERE class_id = 'CLS-2025-002'), 'Kit Collection', 'Your nail technician kit will be available for collection from reception on the first day of class.', 'announcement', 1);

-- Insert sample resources
INSERT INTO public.resources (class_id, title, description, file_url, file_type, visibility) VALUES
((SELECT id FROM public.classes WHERE class_id = 'CLS-2025-001'), 'First Aid Manual', 'Comprehensive guide to emergency first aid procedures', '/resources/first-aid-manual.pdf', 'pdf', 'students'),
((SELECT id FROM public.classes WHERE class_id = 'CLS-2025-001'), 'CPR Quick Reference', 'Step-by-step CPR instructions', '/resources/cpr-guide.pdf', 'pdf', 'students'),
((SELECT id FROM public.classes WHERE class_id = 'CLS-2025-002'), 'Nail Anatomy Chart', 'Detailed diagram of nail structure', '/resources/nail-anatomy.pdf', 'pdf', 'students'),
((SELECT id FROM public.classes WHERE class_id = 'CLS-2025-002'), 'Product Safety Data Sheets', 'Safety information for all chemicals used in course', '/resources/safety-data-sheets.pdf', 'pdf', 'students');

-- Create function to generate student IDs
CREATE OR REPLACE FUNCTION generate_student_id()
RETURNS TEXT AS $$
DECLARE
    new_id TEXT;
    counter INTEGER;
BEGIN
    SELECT COALESCE(MAX(CAST(SUBSTRING(student_id FROM 5) AS INTEGER)), 0) + 1
    INTO counter
    FROM public.student_profiles;
    
    new_id := 'STU-' || LPAD(counter::TEXT, 3, '0');
    RETURN new_id;
END;
$$ LANGUAGE plpgsql;

-- Create function to generate educator IDs
CREATE OR REPLACE FUNCTION generate_educator_id()
RETURNS TEXT AS $$
DECLARE
    new_id TEXT;
    counter INTEGER;
BEGIN
    SELECT COALESCE(MAX(CAST(SUBSTRING(educator_id FROM 5) AS INTEGER)), 0) + 1
    INTO counter
    FROM public.educator_profiles;
    
    new_id := 'EDU-' || LPAD(counter::TEXT, 3, '0');
    RETURN new_id;
END;
$$ LANGUAGE plpgsql;

-- Create function to generate invoice numbers
CREATE OR REPLACE FUNCTION generate_invoice_number()
RETURNS TEXT AS $$
DECLARE
    new_number TEXT;
    counter INTEGER;
BEGIN
    SELECT COALESCE(MAX(CAST(SUBSTRING(invoice_number FROM 5) AS INTEGER)), 0) + 1
    INTO counter
    FROM public.invoices;
    
    new_number := 'INV-' || TO_CHAR(NOW(), 'YYYY') || '-' || LPAD(counter::TEXT, 4, '0');
    RETURN new_number;
END;
$$ LANGUAGE plpgsql;

-- Create triggers to auto-generate IDs
CREATE OR REPLACE FUNCTION set_student_id()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.student_id IS NULL THEN
        NEW.student_id := generate_student_id();
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_set_student_id
    BEFORE INSERT ON public.student_profiles
    FOR EACH ROW
    EXECUTE FUNCTION set_student_id();

CREATE OR REPLACE FUNCTION set_educator_id()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.educator_id IS NULL THEN
        NEW.educator_id := generate_educator_id();
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_set_educator_id
    BEFORE INSERT ON public.educator_profiles
    FOR EACH ROW
    EXECUTE FUNCTION set_educator_id();

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at timestamps
DO $$
DECLARE
    table_name text;
BEGIN
    FOR table_name IN 
        SELECT tablename FROM pg_tables 
        WHERE schemaname = 'public' 
        AND tablename NOT IN ('spatial_ref_sys')
    LOOP
        IF EXISTS (
            SELECT 1 FROM information_schema.columns 
            WHERE table_schema = 'public' 
            AND table_name = table_name 
            AND column_name = 'updated_at'
        ) THEN
            EXECUTE format('
                CREATE TRIGGER trigger_update_%I_updated_at
                    BEFORE UPDATE ON public.%I
                    FOR EACH ROW
                    EXECUTE FUNCTION update_updated_at_column()', table_name, table_name);
        END IF;
    END LOOP;
END $$;
