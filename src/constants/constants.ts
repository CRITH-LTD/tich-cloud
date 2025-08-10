import {
  GraduationCap,
  Building,
  Settings,
  BookOpen,
  Users,
  LucideIcon,
  Crown,
  Shield,
  AlertTriangle,
  Database,
  Key,
  School2Icon,
} from 'lucide-react';
import { Tab } from '../types/ums-settings.types';

export const MODULE_TIERS = {
    "Student Information": {
        basic: {
            price: 12,
            features: [
                "Core student profiles",
                "Contact management",
                "Basic demographics"
            ]
        },
        standard: {
            price: 25,
            features: [
                "Biometric integration",
                "Document tracking",
                "Family relationships",
                "Health records"
            ]
        },
        premium: {
            price: 40,
            features: [
                "AI analytics dashboard",
                "Predictive modeling",
                "Advanced reporting",
                "API integrations"
            ]
        }
    },
    "Program & Courses": {
        basic: {
            price: 15,
            features: [
                "Course catalog",
                "Basic scheduling",
                "Department structure"
            ]
        },
        standard: {
            price: 30,
            features: [
                "Prerequisite tracking",
                "Curriculum mapping",
                "Faculty assignment",
                "Room allocation"
            ]
        },
        premium: {
            price: 50,
            features: [
                "Learning outcomes tracking",
                "Accreditation tools",
                "Workflow automation",
                "Alumni success metrics"
            ]
        }
    },
    "Grading & Transcripts": {
        basic: {
            price: 18,
            features: [
                "Grade entry",
                "GPA calculation",
                "Basic transcripts"
            ]
        },
        standard: {
            price: 35,
            features: [
                "Rubric-based grading",
                "Academic standing",
                "Degree audit",
                "Electronic signature"
            ]
        },
        premium: {
            price: 55,
            features: [
                "Plagiarism detection",
                "Historical trend analysis",
                "Automated advisories",
                "Blockchain verification"
            ]
        }
    },
    "Fees & Payments": {
        basic: {
            price: 20,
            features: [
                "Tuition calculation",
                "Payment tracking",
                "Basic receipts"
            ]
        },
        standard: {
            price: 38,
            features: [
                "Online payment gateway",
                "Installment plans",
                "Financial aid tracking",
                "Tax documentation"
            ]
        },
        premium: {
            price: 60,
            features: [
                "Predictive cash flow",
                "Scholarship matching",
                "Multi-currency support",
                "Government reporting"
            ]
        }
    },
    "Timetable & Calendar": {
        basic: {
            price: 12,
            features: [
                "Class scheduling",
                "Academic calendar",
                "Room booking"
            ]
        },
        standard: {
            price: 25,
            features: [
                "Conflict detection",
                "Faculty workload",
                "Student portal sync",
                "Mobile access"
            ]
        },
        premium: {
            price: 42,
            features: [
                "AI optimization",
                "Resource forecasting",
                "Calendar federation",
                "Event automation"
            ]
        }
    },
    "Exams & Invigilation": {
        basic: {
            price: 18,
            features: [
                "Exam scheduling",
                "Seat allocation",
                "Basic grading"
            ]
        },
        standard: {
            price: 35,
            features: [
                "Online exam proctoring",
                "Question banks",
                "Statistical analysis",
                "Makeup scheduling"
            ]
        },
        premium: {
            price: 55,
            features: [
                "Biometric verification",
                "Predictive cheating detection",
                "Adaptive testing",
                "Certification management"
            ]
        }
    },
    "Attendance & Absences": {
        basic: {
            price: 10,
            features: [
                "Manual attendance",
                "Absence recording",
                "Basic reports"
            ]
        },
        standard: {
            price: 22,
            features: [
                "RFID/NFC tracking",
                "Automated alerts",
                "Pattern detection",
                "Mobile check-in"
            ]
        },
        premium: {
            price: 38,
            features: [
                "Facial recognition",
                "Predictive analytics",
                "Intervention system",
                "Regulatory compliance"
            ]
        }
    },
    "Messaging & Notifications": {
        basic: {
            price: 8,
            features: [
                "Email notifications",
                "Announcements",
                "Basic templates"
            ]
        },
        standard: {
            price: 20,
            features: [
                "SMS integration",
                "Targeted messaging",
                "Delivery tracking",
                "Mobile app push"
            ]
        },
        premium: {
            price: 35,
            features: [
                "Chatbot integration",
                "Sentiment analysis",
                "Emergency alerts",
                "Multi-language support"
            ]
        }
    },
    "Certificates & Clearance": {
        basic: {
            price: 15,
            features: [
                "Certificate templates",
                "Manual approval",
                "PDF generation"
            ]
        },
        standard: {
            price: 30,
            features: [
                "Automated clearance",
                "Digital signatures",
                "QR code verification",
                "Department workflows"
            ]
        },
        premium: {
            price: 50,
            features: [
                "Blockchain validation",
                "Smart contracts",
                "Credential wallet",
                "Third-party verification"
            ]
        }
    },
    "Library Management": {
        basic: {
            price: 12,
            features: [
                "Catalog search",
                "Checkout system",
                "Basic inventory"
            ]
        },
        standard: {
            price: 25,
            features: [
                "RFID tracking",
                "Reservations",
                "E-resources",
                "Fine calculation"
            ]
        },
        premium: {
            price: 45,
            features: [
                "AI recommendations",
                "Usage analytics",
                "Inter-library loans",
                "Preservation tools"
            ]
        }
    },
    "Student Affairs": {
        basic: {
            price: 10,
            features: [
                "Club registration",
                "Event calendar",
                "Basic forms"
            ]
        },
        standard: {
            price: 22,
            features: [
                "Leadership tracking",
                "Service hours",
                "Student organizations",
                "Approval workflows"
            ]
        },
        premium: {
            price: 40,
            features: [
                "Engagement scoring",
                "Alumni networking",
                "Portfolio builder",
                "Wellness tracking"
            ]
        }
    },
    "Accommodation & Housing": {
        basic: {
            price: 15,
            features: [
                "Room inventory",
                "Assignment tracking",
                "Basic billing"
            ]
        },
        standard: {
            price: 30,
            features: [
                "Online applications",
                "Maintenance requests",
                "Visitor management",
                "Meal plan integration"
            ]
        },
        premium: {
            price: 50,
            features: [
                "Smart room controls",
                "Occupancy analytics",
                "Safety monitoring",
                "Community building"
            ]
        }
    },
    "Discipline & Sanctions": {
        basic: {
            price: 12,
            features: [
                "Incident logging",
                "Sanction tracking",
                "Basic reporting"
            ]
        },
        standard: {
            price: 25,
            features: [
                "Case management",
                "Hearing scheduling",
                "Appeal process",
                "Parent notifications"
            ]
        },
        premium: {
            price: 42,
            features: [
                "Behavioral analytics",
                "Early warning system",
                "Restorative justice",
                "Legal compliance"
            ]
        }
    },
    "Alumni & Careers": {
        basic: {
            price: 10,
            features: [
                "Alumni directory",
                "Job postings",
                "Basic surveys"
            ]
        },
        standard: {
            price: 25,
            features: [
                "Career counseling",
                "Mentorship program",
                "Donation tracking",
                "Event management"
            ]
        },
        premium: {
            price: 45,
            features: [
                "AI job matching",
                "Outcome analytics",
                "Corporate partnerships",
                "Lifetime learning"
            ]
        }
    },
    "Analytics & Reporting": {
        basic: {
            price: 20,
            features: [
                "Standard reports",
                "Data export",
                "Basic dashboards"
            ]
        },
        standard: {
            price: 45,
            features: [
                "Custom reports",
                "Visualization tools",
                "Scheduled exports",
                "API access"
            ]
        },
        premium: {
            price: 75,
            features: [
                "Predictive analytics",
                "Machine learning",
                "Real-time monitoring",
                "Executive dashboard"
            ]
        }
    }
}

interface MatriculeConfig {
  name: string;
  category: string;
  format: string;
  placeholders: Record<string, string>;
  sequenceLength: number;
  description: string;
  icon: LucideIcon; // assuming LucideIcon is aliased as any or properly typed elsewhere
}

export const templateSuggestions: MatriculeConfig[] = [
  // Public Universities
  {
    name: 'University of Yaoundé I',
    category: 'Universities',
    format: '{{YY}}{{series}}{{sequence}}',
    placeholders: { YY: '19', series: 'K', sequence: '2776' },
    sequenceLength: 4,
    description: 'Example: 19K2776 (Faculty of Science, 2019)',
    icon: GraduationCap,
  },
  {
    name: 'University of Douala',
    category: 'Universities',
    format: '{{YY}}{{deptLetter}}{{sequence}}',
    placeholders: { YY: '22', deptLetter: 'I', sequence: '01174' },
    sequenceLength: 5,
    description: 'Example: 22I01174 (IUT student, 2022)',
    icon: GraduationCap,
  },
  {
    name: 'University of Dschang',
    category: 'Universities',
    format: 'UDS-{{YY}}{{facCode}}{{sequence}}',
    placeholders: { YY: '24', facCode: 'AGR', sequence: '1234' },
    sequenceLength: 4,
    description: 'Example: UDS-24AGR1234 (Agronomy, 2024)',
    icon: GraduationCap,
  },
  {
    name: 'University of Buea',
    category: 'Universities',
    format: '{{facCode}}{{YY}}{{series}}{{sequence}}',
    placeholders: { facCode: 'SC', YY: '20', series: 'B', sequence: '764' },
    sequenceLength: 3,
    description: 'Example: SC20B764 (Faculty of Science, 2020)',
    icon: GraduationCap,
  },
  {
    name: 'University of Bamenda',
    category: 'Universities',
    format: '{{SchoolCode}}{{YY}}{{ProgramCode}}{{sequence}}',
    placeholders: { SchoolCode: 'HTTTC', YY: '24', ProgramCode: 'TED', sequence: '056' },
    sequenceLength: 3,
    description: 'Example: HTTTC24TED056 (UBa, TED program)',
    icon: GraduationCap,
  },

  // Grandes Écoles
  {
    name: 'ENAM (École Nationale d’Administration et de Magistrature)',
    category: 'Grandes Écoles',
    format: '{{DivisionCode}}{{Cycle}}{{sequence}}',
    placeholders: { DivisionCode: 'AGB', Cycle: 'B', sequence: '1067' },
    sequenceLength: 4,
    description: 'Example: AGB1067 (Admin Générale Cycle B)',
    icon: Building,
  },
  {
    name: 'IRIC (Institut des Relations Internationales du Cameroun)',
    category: 'Grandes Écoles',
    format: 'IRIC{{YY}}{{Section}}{{sequence}}',
    placeholders: { YY: '24', Section: 'DIP', sequence: '001' },
    sequenceLength: 3,
    description: 'Example: IRIC24DIP001 (Diplomacy, 2024)',
    icon: Building,
  },
  {
    name: 'ESSEC (École Supérieure des Sciences Économiques et Commerciales)',
    category: 'Grandes Écoles',
    format: 'ESSEC/{{Campus}}/{{Program}}/{{YY}}/{{sequence}}',
    placeholders: { Campus: 'YDE', Program: 'GF', YY: '24', sequence: '0001' },
    sequenceLength: 4,
    description: 'Example: ESSEC/YDE/GF/24/0001',
    icon: Building,
  },

  // Technical Schools
  {
    name: 'IUT (Institut Universitaire de Technologie)',
    category: 'Technical Schools',
    format: 'IUT{{City}}/{{Dept}}/{{YY}}/{{sequence}}',
    placeholders: { City: 'DLA', Dept: 'GEA', YY: '24', sequence: '0001' },
    sequenceLength: 4,
    description: 'Example: IUTDLA/GEA/24/0001',
    icon: Settings,
  },
  {
    name: 'ENSP (École Nationale Supérieure Polytechnique)',
    category: 'Technical Schools',
    format: 'ENSP/{{Dept}}/{{Cycle}}/{{YY}}{{sequence}}',
    placeholders: { Dept: 'GIN', Cycle: 'ING', YY: '24', sequence: '023' },
    sequenceLength: 3,
    description: 'Example: ENSP/GIN/ING/24023',
    icon: Settings,
  },

  // Secondary Schools
  {
    name: 'Lycée Général Leclerc',
    category: 'Secondary Schools',
    format: 'LGL/{{Series}}/{{Class}}/{{YY}}/{{sequence}}',
    placeholders: { Series: 'C', Class: 'TLE', YY: '24', sequence: '001' },
    sequenceLength: 3,
    description: 'Example: LGL/C/TLE/24/001',
    icon: BookOpen,
  },
  {
    name: 'Collège de la Retraite',
    category: 'Secondary Schools',
    format: 'CDR{{YY}}{{Class}}{{sequence}}',
    placeholders: { YY: '24', Class: '6EME', sequence: '01' },
    sequenceLength: 2,
    description: 'Example: CDR246EME01',
    icon: BookOpen,
  },

  // Private Institutions
  {
    name: 'Institut Supérieur de Management',
    category: 'Private Institutions',
    format: 'ISM/{{Campus}}/{{Program}}/{{Intake}}/{{sequence}}',
    placeholders: { Campus: 'YDE', Program: 'MBA', Intake: '2024', sequence: '0001' },
    sequenceLength: 4,
    description: 'Example: ISM/YDE/MBA/2024/0001',
    icon: Users,
  },
  {
    name: 'UCAC (Université Catholique d’Afrique Centrale)',
    category: 'Private Institutions',
    format: 'UCAC/{{Faculty}}/{{YY}}/{{sequence}}',
    placeholders: { Faculty: 'FGSE', YY: '24', sequence: '00001' },
    sequenceLength: 5,
    description: 'Example: UCAC/FGSE/24/00001',
    icon: Users,
  },
  {
    name: 'HIMS Buea (Higher Institute of Management Studies)',
    category: 'Private Institutions',
    format: 'HIMS/{{Program}}/{{YY}}/{{sequence}}',
    placeholders: { Program: 'BTECH', YY: '24', sequence: '0001' },
    sequenceLength: 4,
    description: 'Example: HIMS/BTECH/24/0001',
    icon: Users,
  },
  {
    name: 'HIBMAT Buea (Higher Institute of Business Management and Technology)',
    category: 'Private Institutions',
    format: 'HIBMAT/{{Dept}}/{{YY}}/{{sequence}}',
    placeholders: { Dept: 'ACC', YY: '24', sequence: '0001' },
    sequenceLength: 4,
    description: 'Example: HIBMAT/ACC/24/0001',
    icon: Users,
  }
];

export const TABS: Tab[] = [
  { id: 'general', label: 'General', icon: Settings },
  { id: 'admin', label: 'Admin', icon: Crown },
  { id: 'security', label: 'Security', icon: Shield },
  { id: 'roles', label: 'Roles & Permissions', icon: Key },
  { id: 'departments', label: 'Departments', icon: School2Icon },
  { id: 'modules', label: 'Modules & Platforms', icon: Database },
  { id: 'danger', label: 'Danger Zone', icon: AlertTriangle }
];