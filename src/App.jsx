import React, { useState, useEffect } from 'react';
import {
  Wrench,
  AlertCircle,
  CheckCircle,
  Clock,
  Filter,
  X,
  FileText,
  User,
  MapPin,
  Camera,
  Image as ImageIcon,
  Calendar,
  Activity
} from 'lucide-react';
import versionInfo from './version.json';
import { issueReportSimpleService } from './services/issueReportSimple.service';
import { equipmentService } from './services/equipment.service';
import { issueService } from './services/issue.service';
import { supabase } from './lib/supabase';

function App() {
  // Staff members directory
  const staffMembers = [
    { name: 'Aman', role: 'Clinical Lead', department: 'Clinical' },
    { name: 'Neesha', role: 'Clinical Lead', department: 'Clinical' },
    { name: 'Kashish', role: 'Operations Manager', department: 'Operations' },
    { name: 'Diksha', role: 'Operations Manager', department: 'Operations' },
    { name: 'Abhishek', role: 'Marketing Manager', department: 'Marketing' },
    { name: 'Anas', role: 'Performance & Feedback Manager', department: 'Performance' },
    { name: 'Jagruti', role: 'HR & Training Manager', department: 'HR' },
    { name: 'Suraj Rajput', role: 'Staff Member', department: 'General' },
    { name: 'Gaurav Agrawal', role: 'Staff Member', department: 'General' },
    { name: 'Sachin', role: 'RMO (Resident Medical Officer)', department: 'Clinical' },
    { name: 'Shiraz', role: 'RMO (Resident Medical Officer)', department: 'Clinical' },
    { name: 'Amand Rajak', role: 'Service Engineer', department: 'Maintenance' }
  ];

  // Initial equipment data (mock data as fallback)
  const [equipment, setEquipment] = useState([
    {
      id: 'EQ-001',
      name: 'Suction Machine',
      location: 'Hope Hospital',
      category: 'ICU',
      status: 'Operational',
      lastMaintenance: new Date('2024-11-15'),
      issueDescription: null,
      reportedBy: null,
      images: []
    },
    {
      id: 'EQ-002',
      name: 'Air Compressor',
      location: 'Hope Hospital',
      category: 'General',
      status: 'Operational',
      lastMaintenance: new Date('2024-11-20'),
      issueDescription: null,
      reportedBy: null,
      images: []
    },
    {
      id: 'EQ-003',
      name: 'Suction Machine',
      location: 'Ayushman Hospital',
      category: 'ICU',
      status: 'Needs Repair',
      lastMaintenance: new Date('2024-10-10'),
      issueDescription: 'Motor not starting',
      reportedBy: 'Dr. Smith',
      images: []
    },
    {
      id: 'EQ-004',
      name: 'Air Compressor',
      location: 'Ayushman Hospital',
      category: 'General',
      status: 'Needs Repair',
      lastMaintenance: new Date('2024-11-18'),
      issueDescription: '4 bolts are loose',
      reportedBy: 'Maintenance Team',
      images: []
    },
    {
      id: 'EQ-005',
      name: 'Lift',
      location: 'Hope Hospital',
      category: 'General',
      status: 'Operational',
      lastMaintenance: new Date('2024-11-10'),
      issueDescription: null,
      reportedBy: null,
      images: []
    },
    {
      id: 'EQ-006',
      name: 'O2 Plant',
      location: 'Hope Hospital',
      category: 'General',
      status: 'Operational',
      lastMaintenance: new Date('2024-11-25'),
      issueDescription: null,
      reportedBy: null,
      images: []
    },
    {
      id: 'EQ-007',
      name: 'Cathlab',
      location: 'Hope Hospital',
      category: 'OT',
      status: 'Needs Repair',
      lastMaintenance: new Date('2024-11-01'),
      issueDescription: 'Cathlab AC is not working',
      reportedBy: 'Dr. Patel',
      images: []
    },
    {
      id: 'EQ-008',
      name: 'Generator',
      location: 'Hope Hospital',
      category: 'General',
      status: 'Operational',
      lastMaintenance: new Date('2024-11-22'),
      issueDescription: null,
      reportedBy: null,
      images: []
    },
    {
      id: 'EQ-009',
      name: 'Lab Equipment',
      location: 'Hope Hospital',
      category: 'Lab',
      status: 'Operational',
      lastMaintenance: new Date('2024-11-12'),
      issueDescription: null,
      reportedBy: null,
      images: []
    },
    {
      id: 'EQ-010',
      name: 'C-arm',
      location: 'Hope Hospital',
      category: 'OT',
      status: 'Operational',
      lastMaintenance: new Date('2024-11-08'),
      issueDescription: null,
      reportedBy: null,
      images: []
    },
    {
      id: 'EQ-011',
      name: 'X-Ray',
      location: 'Hope Hospital',
      category: 'Lab',
      status: 'Operational',
      lastMaintenance: new Date('2024-11-05'),
      issueDescription: null,
      reportedBy: null,
      images: []
    },
    {
      id: 'EQ-012',
      name: 'Ultrasound',
      location: 'Hope Hospital',
      category: 'Lab',
      status: 'Operational',
      lastMaintenance: new Date('2024-11-14'),
      issueDescription: null,
      reportedBy: null,
      images: []
    },
    {
      id: 'EQ-013',
      name: 'Lift',
      location: 'Ayushman Hospital',
      category: 'General',
      status: 'Operational',
      lastMaintenance: new Date('2024-11-12'),
      issueDescription: null,
      reportedBy: null,
      images: []
    },
    {
      id: 'EQ-014',
      name: 'O2 Plant',
      location: 'Ayushman Hospital',
      category: 'General',
      status: 'Operational',
      lastMaintenance: new Date('2024-11-28'),
      issueDescription: null,
      reportedBy: null,
      images: []
    },
    {
      id: 'EQ-015',
      name: 'Generator',
      location: 'Ayushman Hospital',
      category: 'General',
      status: 'Operational',
      lastMaintenance: new Date('2024-11-19'),
      issueDescription: null,
      reportedBy: null,
      images: []
    },
    {
      id: 'EQ-016',
      name: 'Lab Equipment',
      location: 'Ayushman Hospital',
      category: 'Lab',
      status: 'Operational',
      lastMaintenance: new Date('2024-11-16'),
      issueDescription: null,
      reportedBy: null,
      images: []
    },
    {
      id: 'EQ-017',
      name: 'X-Ray',
      location: 'Ayushman Hospital',
      category: 'Lab',
      status: 'Operational',
      lastMaintenance: new Date('2024-11-09'),
      issueDescription: null,
      reportedBy: null,
      images: []
    },
    {
      id: 'EQ-018',
      name: 'Ultrasound',
      location: 'Ayushman Hospital',
      category: 'Lab',
      status: 'Operational',
      lastMaintenance: new Date('2024-11-17'),
      issueDescription: null,
      reportedBy: null,
      images: []
    },
    {
      id: 'EQ-019',
      name: 'Dialysis Machine',
      location: 'Ayushman Hospital',
      category: 'Ward',
      status: 'Operational',
      lastMaintenance: new Date('2024-11-21'),
      issueDescription: null,
      reportedBy: null,
      images: []
    },
    {
      id: 'EQ-020',
      name: 'Patient Monitor',
      location: 'Hope Hospital',
      category: 'ICU',
      status: 'Operational',
      lastMaintenance: new Date('2024-11-23'),
      issueDescription: null,
      reportedBy: null,
      images: []
    },
    {
      id: 'EQ-021',
      name: 'Ventilator',
      location: 'Hope Hospital',
      category: 'ICU',
      status: 'Operational',
      lastMaintenance: new Date('2024-11-26'),
      issueDescription: null,
      reportedBy: null,
      images: []
    },
    {
      id: 'EQ-022',
      name: 'OT Table',
      location: 'Hope Hospital',
      category: 'OT',
      status: 'Operational',
      lastMaintenance: new Date('2024-11-18'),
      issueDescription: null,
      reportedBy: null,
      images: []
    },
    {
      id: 'EQ-023',
      name: 'Anesthesia Machine',
      location: 'Ayushman Hospital',
      category: 'OT',
      status: 'Operational',
      lastMaintenance: new Date('2024-11-20'),
      issueDescription: null,
      reportedBy: null,
      images: []
    },
    {
      id: 'EQ-024',
      name: 'TENS Unit',
      location: 'Hope Hospital',
      category: 'Physiotherapy',
      status: 'Operational',
      lastMaintenance: new Date('2024-11-15'),
      issueDescription: null,
      reportedBy: null,
      images: []
    },
    {
      id: 'EQ-025',
      name: 'Treadmill',
      location: 'Ayushman Hospital',
      category: 'Physiotherapy',
      status: 'Operational',
      lastMaintenance: new Date('2024-11-10'),
      issueDescription: null,
      reportedBy: null,
      images: []
    },
    {
      id: 'EQ-026',
      name: 'Hospital Bed',
      location: 'Hope Hospital',
      category: 'Ward',
      status: 'Operational',
      lastMaintenance: new Date('2024-11-08'),
      issueDescription: null,
      reportedBy: null,
      images: []
    },
    {
      id: 'EQ-027',
      name: 'IV Stand',
      location: 'Ayushman Hospital',
      category: 'Ward',
      status: 'Operational',
      lastMaintenance: new Date('2024-11-12'),
      issueDescription: null,
      reportedBy: null,
      images: []
    }
  ]);
  const [loading, setLoading] = useState(false);

  const [activityLog, setActivityLog] = useState([
    {
      id: 1,
      timestamp: new Date('2024-11-10T10:30:00'),
      action: 'Issue Reported',
      equipmentName: 'Suction Machine',
      location: 'Ayushman Hospital',
      description: 'Motor not starting reported by Dr. Smith'
    }
  ]);

  const [selectedLocationFilter, setSelectedLocationFilter] = useState('All');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('All');
  const [isTechnicianMode, setIsTechnicianMode] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [selectedEquipment, setSelectedEquipment] = useState(null);
  const [issueForm, setIssueForm] = useState({
    description: '',
    reportedBy: '',
    images: []
  });

  // Fetch issues from Supabase and update equipment with issue details
  useEffect(() => {
    const fetchIssuesAndUpdateEquipment = async () => {
      try {
        console.log('🔄 Fetching issues with equipment details from Supabase...');
        setLoading(true);

        // Fetch all issues with equipment details using join
        const { data: issuesWithEquipment, error } = await supabase
          .from('issues')
          .select(`
            *,
            equipment!inner(
              id,
              equipment_id,
              name
            )
          `)
          .order('created_at', { ascending: false });

        if (error) {
          console.error('❌ Error fetching issues:', error);
          throw error;
        }

        console.log(`✅ Fetched ${issuesWithEquipment?.length || 0} issues from database`);
        console.log('Issues data:', issuesWithEquipment);

        if (issuesWithEquipment && issuesWithEquipment.length > 0) {
          // Update equipment state with issue information
          setEquipment(prevEquipment =>
            prevEquipment.map(eq => {
              // Find latest issue for this equipment by matching equipment_id (EQ-001, etc.)
              const equipmentIssues = issuesWithEquipment.filter(issue => {
                const dbEquipmentId = issue.equipment?.equipment_id;
                return dbEquipmentId && dbEquipmentId === eq.id;
              });

              const latestIssue = equipmentIssues.length > 0 ? equipmentIssues[0] : null;

              // If issue exists, update equipment with issue details
              if (latestIssue) {
                console.log(`🔧 Updating ${eq.id} with issue:`, latestIssue.description);
                return {
                  ...eq,
                  status: 'Needs Repair',
                  issueDescription: latestIssue.description,
                  reportedBy: latestIssue.reported_by,
                  images: latestIssue.attachments || []
                };
              }

              return eq; // Return equipment as-is if no issues
            })
          );

          console.log('✅ Equipment updated with issue data from database');
        } else {
          console.log('ℹ️ No issues found in database, using mock data as-is');
        }
      } catch (error) {
        console.error('⚠️ Error fetching issues:', error);
        console.log('Using mock data without Supabase integration');
      } finally {
        setLoading(false);
      }
    };

    fetchIssuesAndUpdateEquipment();
  }, []);

  // Filter equipment based on selected location and category
  const filteredEquipment = equipment.filter(eq => {
    const matchesLocation = selectedLocationFilter === 'All' || eq.location === selectedLocationFilter;
    const matchesCategory = selectedCategoryFilter === 'All' || eq.category === selectedCategoryFilter;
    return matchesLocation && matchesCategory;
  });

  // Get status badge styling
  const getStatusBadge = (status) => {
    const styles = {
      'Operational': 'bg-gradient-to-r from-green-50 to-emerald-50 text-green-700 border-green-200 shadow-sm',
      'Needs Repair': 'bg-gradient-to-r from-red-50 to-rose-50 text-red-700 border-red-200 shadow-sm',
      'Maintenance Due': 'bg-gradient-to-r from-yellow-50 to-amber-50 text-yellow-700 border-yellow-200 shadow-sm'
    };
    return styles[status] || 'bg-gray-100 text-gray-800 border-gray-300';
  };

  // Get status icon
  const getStatusIcon = (status) => {
    if (status === 'Operational') return <CheckCircle className="w-5 h-5" />;
    if (status === 'Needs Repair') return <AlertCircle className="w-5 h-5" />;
    return <Clock className="w-5 h-5" />;
  };

  // Handle image upload
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const imagePromises = files.map(file => {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (event) => {
          resolve({
            data: event.target.result,
            timestamp: new Date(),
            filename: file.name
          });
        };
        reader.readAsDataURL(file);
      });
    });

    Promise.all(imagePromises).then(newImages => {
      setIssueForm(prev => ({
        ...prev,
        images: [...prev.images, ...newImages]
      }));
    });
  };

  // Remove uploaded image
  const removeImage = (index) => {
    setIssueForm(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  // Handle report issue
  const handleReportIssue = (eq) => {
    setSelectedEquipment(eq);
    setShowReportModal(true);
    setIssueForm({ description: '', reportedBy: '', images: [] });
  };

  // Send WhatsApp notification to service engineer
  const sendWhatsAppNotification = (equipment, issue, reportedBy, timestamp) => {
    // Service Engineer: Amand Rajak
    const phoneNumber = '919370089063';

    const message = `🚨 *EQUIPMENT ISSUE REPORTED*

📍 *Location:* ${equipment.location}
🔧 *Equipment:* ${equipment.name} (${equipment.id})
⚠️ *Issue:* ${issue}
👤 *Reported By:* ${reportedBy}
🕐 *Time:* ${new Date(timestamp).toLocaleString()}

Please attend to this issue at the earliest.

- Hospital Maintenance System`;

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;

    // Open WhatsApp in new window
    window.open(whatsappUrl, '_blank');
  };

  // Submit issue report
  const submitIssueReport = async () => {
    if (!issueForm.description || !issueForm.reportedBy) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      const reportTimestamp = new Date();

      console.log('🚀 Submitting issue report to Supabase...');
      console.log('Selected Equipment:', selectedEquipment);
      console.log('Issue Form:', issueForm);

      // Submit to Supabase (without photos for now)
      const createdIssue = await issueReportSimpleService.submitIssueReport({
        equipmentId: selectedEquipment.id,
        issueDescription: issueForm.description,
        reportedBy: issueForm.reportedBy,
        severity: 'moderate' // You can add a severity selector in the form
      });

      console.log('✅ Issue created in Supabase:', createdIssue);

      // Update local state for immediate UI feedback
      setEquipment(equipment.map(eq =>
        eq.id === selectedEquipment.id
          ? {
              ...eq,
              status: 'Needs Repair',
              issueDescription: issueForm.description,
              reportedBy: issueForm.reportedBy,
              images: issueForm.images,
              reportTimestamp: reportTimestamp
            }
          : eq
      ));

      // Add to activity log (local state)
      const newActivity = {
        id: activityLog.length + 1,
        timestamp: reportTimestamp,
        action: 'Issue Reported',
        equipmentName: selectedEquipment.name,
        location: selectedEquipment.location,
        description: `${issueForm.description} reported by ${issueForm.reportedBy}`,
        images: issueForm.images
      };
      setActivityLog([newActivity, ...activityLog]);

      // Send WhatsApp notification to service engineer
      sendWhatsAppNotification(
        selectedEquipment,
        issueForm.description,
        issueForm.reportedBy,
        reportTimestamp
      );

      // Show success message
      alert('Issue reported successfully and saved to database!');

      // Close modal
      setShowReportModal(false);
      setSelectedEquipment(null);
    } catch (error) {
      console.error('Error submitting issue report:', error);
      alert('Failed to submit issue report. Please try again.');
    }
  };

  // Mark equipment as resolved
  const markAsResolved = (eq) => {
    setEquipment(equipment.map(item =>
      item.id === eq.id
        ? {
            ...item,
            status: 'Operational',
            issueDescription: null,
            reportedBy: null,
            images: []
          }
        : item
    ));

    // Add to activity log
    const newActivity = {
      id: activityLog.length + 1,
      timestamp: new Date(),
      action: 'Repair Completed',
      equipmentName: eq.name,
      location: eq.location,
      description: `Equipment marked as operational`
    };
    setActivityLog([newActivity, ...activityLog]);
  };

  // Log monthly maintenance
  const logMonthlyMaintenance = (eq) => {
    const maintenanceDate = new Date();

    setEquipment(equipment.map(item =>
      item.id === eq.id
        ? {
            ...item,
            lastMaintenance: maintenanceDate
          }
        : item
    ));

    // Add to activity log
    const newActivity = {
      id: activityLog.length + 1,
      timestamp: maintenanceDate,
      action: 'Monthly Maintenance',
      equipmentName: eq.name,
      location: eq.location,
      description: `Monthly maintenance completed`
    };
    setActivityLog([newActivity, ...activityLog]);
  };

  // Format date
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Format timestamp
  const formatTimestamp = (date) => {
    return new Date(date).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-lg shadow-lg border-b border-gray-200/50 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-3 sm:py-5">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="p-1.5 sm:p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg sm:rounded-xl shadow-lg">
                <Wrench className="w-5 h-5 sm:w-7 sm:h-7 text-white" />
              </div>
              <div>
                <h1 className="text-lg sm:text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  Hospital Equipment Maintenance
                </h1>
                <p className="text-xs text-gray-600 mt-0.5 hidden sm:block">Real-time monitoring & management</p>
              </div>
            </div>

            {/* Mode Toggle */}
            <div className="flex items-center justify-between sm:justify-start gap-2 sm:gap-3 bg-white rounded-lg sm:rounded-xl p-2 shadow-md border border-gray-200">
              <span className="text-xs sm:text-sm font-semibold text-gray-700 px-1 sm:px-2">
                {isTechnicianMode ? '🔧 Technician' : '👤 Staff'}
              </span>
              <button
                onClick={() => setIsTechnicianMode(!isTechnicianMode)}
                className={`relative inline-flex h-6 sm:h-7 w-12 sm:w-14 items-center rounded-full transition-all duration-300 ${
                  isTechnicianMode
                    ? 'bg-gradient-to-r from-blue-500 to-indigo-600 shadow-lg shadow-blue-500/50'
                    : 'bg-gray-300'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 sm:h-5 sm:w-5 transform rounded-full bg-white shadow-lg transition-transform duration-300 ${
                    isTechnicianMode ? 'translate-x-7 sm:translate-x-8' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8">
        {/* Filters */}
        <div className="mb-6 sm:mb-8 space-y-4 sm:space-y-6">
          {/* Location Filters */}
          <div className="bg-white/80 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg border border-gray-200/50">
            <div className="flex items-center gap-2 mb-3 sm:mb-4">
              <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
              <span className="text-xs sm:text-sm font-bold text-gray-800">Filter by Location</span>
            </div>
            <div className="flex flex-wrap gap-2 sm:gap-3">
              {['All', 'Hope Hospital', 'Ayushman Hospital'].map(filter => (
                <button
                  key={filter}
                  onClick={() => setSelectedLocationFilter(filter)}
                  className={`px-3 py-2 sm:px-5 sm:py-2.5 rounded-lg sm:rounded-xl font-semibold text-xs sm:text-sm transition-all duration-200 active:scale-95 sm:hover:scale-105 ${
                    selectedLocationFilter === filter
                      ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/50'
                      : 'bg-white text-gray-700 border-2 border-gray-200 active:border-blue-300 sm:hover:border-blue-300 sm:hover:shadow-md'
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>

          {/* Category Filters */}
          <div className="bg-white/80 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg border border-gray-200/50">
            <div className="flex items-center gap-2 mb-3 sm:mb-4">
              <Filter className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600" />
              <span className="text-xs sm:text-sm font-bold text-gray-800">Filter by Category</span>
            </div>
            <div className="flex flex-wrap gap-2 sm:gap-3">
              {['All', 'ICU', 'OT', 'Lab', 'Physiotherapy', 'Ward', 'General'].map(filter => (
                <button
                  key={filter}
                  onClick={() => setSelectedCategoryFilter(filter)}
                  className={`px-3 py-2 sm:px-5 sm:py-2.5 rounded-lg sm:rounded-xl font-semibold text-xs sm:text-sm transition-all duration-200 active:scale-95 sm:hover:scale-105 ${
                    selectedCategoryFilter === filter
                      ? 'bg-gradient-to-r from-purple-500 to-pink-600 text-white shadow-lg shadow-purple-500/50'
                      : 'bg-white text-gray-700 border-2 border-gray-200 active:border-purple-300 sm:hover:border-purple-300 sm:hover:shadow-md'
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Equipment Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
              <p className="text-gray-600">Loading equipment data from database...</p>
            </div>
          </div>
        ) : equipment.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-600 text-lg mb-2">No equipment found in database</p>
            <p className="text-gray-500 text-sm">Please add equipment data to Supabase</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
            {filteredEquipment.map(eq => (
            <div
              key={eq.id}
              className="bg-white/90 backdrop-blur-sm rounded-xl sm:rounded-2xl shadow-xl border border-gray-200/50 overflow-hidden active:shadow-2xl sm:hover:shadow-2xl transition-all duration-300 sm:transform sm:hover:-translate-y-1"
            >
              <div className="p-4 sm:p-6">
                {/* Header */}
                <div className="flex items-start justify-between mb-3 sm:mb-4">
                  <div className="flex-1">
                    <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-1.5 sm:mb-2">
                      {eq.name}
                    </h3>
                    <div className="flex items-center gap-1 sm:gap-1.5 text-xs sm:text-sm text-gray-600 mb-1.5 sm:mb-2">
                      <MapPin className="w-3 h-3 sm:w-4 sm:h-4" />
                      <span>{eq.location}</span>
                    </div>
                    <div className="inline-block">
                      <span className="text-xs font-bold text-purple-700 bg-gradient-to-r from-purple-100 to-pink-100 px-2 py-1 sm:px-3 sm:py-1.5 rounded-full border border-purple-200">
                        {eq.category}
                      </span>
                    </div>
                  </div>
                  <span className="text-xs font-mono text-gray-500 bg-gray-100 px-2 py-1 sm:px-3 sm:py-1.5 rounded-md sm:rounded-lg h-fit border border-gray-200">
                    {eq.id}
                  </span>
                </div>

                {/* Status Badge */}
                <div className={`inline-flex items-center gap-1.5 sm:gap-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg sm:rounded-xl border-2 mb-3 sm:mb-4 ${getStatusBadge(eq.status)}`}>
                  {getStatusIcon(eq.status)}
                  <span className="text-xs sm:text-sm font-bold">{eq.status}</span>
                </div>

                {/* Details */}
                <div className="space-y-3 mb-4">
                  <div className="text-sm bg-gradient-to-r from-blue-50 to-indigo-50 p-3 rounded-xl border border-blue-100">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-blue-600" />
                      <span className="text-gray-600">Last Maintenance:</span>
                    </div>
                    <span className="ml-6 font-bold text-gray-900">
                      {formatDate(eq.lastMaintenance)}
                    </span>
                  </div>

                  {eq.issueDescription && (
                    <div className="text-sm bg-gradient-to-r from-red-50 to-rose-50 p-4 rounded-xl border-2 border-red-200 space-y-2">
                      <div className="font-bold text-red-900 flex items-center gap-2">
                        <AlertCircle className="w-4 h-4" />
                        Issue Details:
                      </div>
                      <div className="text-red-800 font-medium">{eq.issueDescription}</div>
                      <div className="text-xs text-red-600">
                        Reported by: <span className="font-semibold">{eq.reportedBy}</span>
                      </div>
                      {eq.reportTimestamp && (
                        <div className="text-xs text-red-600">
                          Reported: {formatTimestamp(eq.reportTimestamp)}
                        </div>
                      )}
                      {eq.images && eq.images.length > 0 && (
                        <div className="mt-3">
                          <div className="text-xs font-bold text-red-900 mb-2">
                            📷 Attached Photos ({eq.images.length}):
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            {eq.images.map((img, idx) => (
                              <img
                                key={idx}
                                src={img.data}
                                alt={`Issue ${idx + 1}`}
                                className="w-full h-20 object-cover rounded-lg border-2 border-red-300 cursor-pointer hover:opacity-75 transition-opacity"
                                onClick={() => window.open(img.data, '_blank')}
                              />
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-2 sm:gap-3">
                  {!isTechnicianMode && eq.status === 'Operational' && (
                    <button
                      onClick={() => handleReportIssue(eq)}
                      className="w-full px-3 py-2.5 sm:px-4 sm:py-3 bg-gradient-to-r from-red-500 to-rose-600 text-white rounded-lg sm:rounded-xl font-bold active:from-red-600 active:to-rose-700 sm:hover:from-red-600 sm:hover:to-rose-700 transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-red-500/30 active:scale-95 sm:transform sm:hover:scale-105"
                    >
                      <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                      <span className="text-sm sm:text-base">Report Issue</span>
                    </button>
                  )}

                  {isTechnicianMode && (
                    <>
                      {eq.status === 'Needs Repair' && (
                        <button
                          onClick={() => markAsResolved(eq)}
                          className="w-full px-3 py-2.5 sm:px-4 sm:py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg sm:rounded-xl font-bold active:from-green-600 active:to-emerald-700 sm:hover:from-green-600 sm:hover:to-emerald-700 transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-green-500/30 active:scale-95 sm:transform sm:hover:scale-105"
                        >
                          <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                          <span className="text-sm sm:text-base">Mark Resolved</span>
                        </button>
                      )}
                      <button
                        onClick={() => logMonthlyMaintenance(eq)}
                        className="w-full px-3 py-2.5 sm:px-4 sm:py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg sm:rounded-xl font-bold active:from-blue-600 active:to-indigo-700 sm:hover:from-blue-600 sm:hover:to-indigo-700 transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-blue-500/30 active:scale-95 sm:transform sm:hover:scale-105"
                      >
                        <Activity className="w-4 h-4 sm:w-5 sm:h-5" />
                        <span className="text-sm sm:text-base">Log Monthly Maintenance</span>
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
            ))}
          </div>
        )}

        {/* Activity Log */}
        <div className="bg-white/90 backdrop-blur-sm rounded-xl sm:rounded-2xl shadow-xl border border-gray-200/50 p-4 sm:p-6">
          <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
            <div className="p-1.5 sm:p-2 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg sm:rounded-xl">
              <FileText className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">Recent Activity</h2>
          </div>

          <div className="space-y-3 sm:space-y-4">
            {activityLog.length === 0 ? (
              <p className="text-gray-500 text-center py-6 sm:py-8 text-sm sm:text-base">No activity yet</p>
            ) : (
              activityLog.map(activity => (
                <div
                  key={activity.id}
                  className="flex items-start gap-3 sm:gap-4 p-3 sm:p-5 bg-gradient-to-r from-gray-50 to-slate-50 rounded-lg sm:rounded-xl border-2 border-gray-200 active:shadow-lg sm:hover:shadow-lg transition-all duration-200"
                >
                  <div className="flex-shrink-0 mt-0.5 sm:mt-1">
                    {activity.action === 'Issue Reported' && (
                      <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-red-100 to-rose-100 rounded-full flex items-center justify-center border-2 border-red-300">
                        <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-red-600" />
                      </div>
                    )}
                    {activity.action === 'Repair Completed' && (
                      <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-green-100 to-emerald-100 rounded-full flex items-center justify-center border-2 border-green-300">
                        <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
                      </div>
                    )}
                    {activity.action === 'Monthly Maintenance' && (
                      <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center border-2 border-blue-300">
                        <Wrench className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1.5 sm:mb-2">
                      <h4 className="font-bold text-gray-900 text-sm sm:text-lg">{activity.action}</h4>
                      <span className="text-xs text-gray-500 whitespace-nowrap bg-white px-2 py-0.5 sm:px-3 sm:py-1 rounded-full border border-gray-200">
                        {formatTimestamp(activity.timestamp)}
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm text-gray-700 mb-1">
                      <span className="font-bold">{activity.equipmentName}</span> at{' '}
                      <span className="font-bold">{activity.location}</span>
                    </p>
                    <p className="text-xs sm:text-sm text-gray-600">{activity.description}</p>
                    {activity.images && activity.images.length > 0 && (
                      <div className="mt-3">
                        <div className="flex items-center gap-1 text-xs text-gray-600 mb-2">
                          <ImageIcon className="w-4 h-4" />
                          <span className="font-semibold">{activity.images.length} photo(s) attached</span>
                        </div>
                        <div className="flex gap-2 flex-wrap">
                          {activity.images.map((img, idx) => (
                            <img
                              key={idx}
                              src={img.data}
                              alt={`Activity ${idx + 1}`}
                              className="w-20 h-20 object-cover rounded-lg border-2 border-gray-300 cursor-pointer hover:opacity-75 transition-opacity shadow-md"
                              onClick={() => window.open(img.data, '_blank')}
                            />
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </main>

      {/* Report Issue Modal */}
      {showReportModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 z-50 animate-fadeIn">
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
              <h3 className="text-lg sm:text-xl font-bold text-gray-900">Report Equipment Issue</h3>
              <button
                onClick={() => setShowReportModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors p-1 hover:bg-white rounded-lg"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-4 sm:p-6 space-y-4 sm:space-y-5">
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-xl border-2 border-blue-200">
                <div className="text-sm font-bold text-blue-900">
                  {selectedEquipment?.name}
                </div>
                <div className="text-xs text-blue-700 mt-1">
                  {selectedEquipment?.location} • {selectedEquipment?.id}
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Issue Description *
                </label>
                <textarea
                  value={issueForm.description}
                  onChange={(e) => setIssueForm({...issueForm, description: e.target.value})}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  rows="4"
                  placeholder="Describe the issue in detail..."
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Reported By *
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none z-10" />
                  <select
                    value={issueForm.reportedBy}
                    onChange={(e) => setIssueForm({...issueForm, reportedBy: e.target.value})}
                    className="w-full pl-11 pr-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none appearance-none bg-white transition-all"
                  >
                    <option value="">Select staff member...</option>
                    <optgroup label="Clinical Team">
                      <option value="Aman (Clinical Lead)">Aman (Clinical Lead)</option>
                      <option value="Neesha (Clinical Lead)">Neesha (Clinical Lead)</option>
                      <option value="Dr. Sachin (RMO)">Dr. Sachin (RMO)</option>
                      <option value="Dr. Shiraz (RMO)">Dr. Shiraz (RMO)</option>
                    </optgroup>
                    <optgroup label="Operations Team">
                      <option value="Kashish (Operations)">Kashish (Operations)</option>
                      <option value="Diksha (Operations)">Diksha (Operations)</option>
                    </optgroup>
                    <optgroup label="Marketing">
                      <option value="Abhishek (Marketing)">Abhishek (Marketing)</option>
                    </optgroup>
                    <optgroup label="Performance & Feedback">
                      <option value="Anas (Performance)">Anas (Performance)</option>
                    </optgroup>
                    <optgroup label="HR & Training">
                      <option value="Jagruti (HR)">Jagruti (HR)</option>
                    </optgroup>
                    <optgroup label="Other Staff">
                      <option value="Suraj Rajput">Suraj Rajput</option>
                      <option value="Gaurav Agrawal">Gaurav Agrawal</option>
                      <option value="Amand Rajak (Service Engineer)">Amand Rajak (Service Engineer)</option>
                    </optgroup>
                    <optgroup label="Nursing Staff">
                      <option value="Nurse">Nursing Staff</option>
                    </optgroup>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Upload Photos (Optional)
                </label>
                <div className="space-y-3">
                  <label className="flex items-center justify-center gap-2 px-4 py-4 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-all">
                    <Camera className="w-6 h-6 text-gray-600" />
                    <span className="text-sm font-bold text-gray-700">Take or Upload Photo</span>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      capture="environment"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>

                  {issueForm.images.length > 0 && (
                    <div className="grid grid-cols-2 gap-3">
                      {issueForm.images.map((img, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={img.data}
                            alt={`Upload ${index + 1}`}
                            className="w-full h-28 object-cover rounded-xl border-2 border-gray-200"
                          />
                          <div className="absolute top-2 right-2">
                            <button
                              onClick={() => removeImage(index)}
                              className="bg-red-500 text-white rounded-full p-1.5 hover:bg-red-600 transition-colors shadow-lg"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                          <div className="text-xs text-gray-600 mt-1 font-medium text-center">
                            {new Date(img.timestamp).toLocaleTimeString()}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="flex gap-2 sm:gap-3 p-4 sm:p-6 border-t border-gray-200 bg-gray-50">
              <button
                onClick={() => setShowReportModal(false)}
                className="flex-1 px-3 py-2.5 sm:px-4 sm:py-3 border-2 border-gray-300 text-gray-700 rounded-lg sm:rounded-xl font-bold active:bg-gray-100 sm:hover:bg-gray-100 transition-all text-sm sm:text-base"
              >
                Cancel
              </button>
              <button
                onClick={submitIssueReport}
                className="flex-1 px-3 py-2.5 sm:px-4 sm:py-3 bg-gradient-to-r from-red-500 to-rose-600 text-white rounded-lg sm:rounded-xl font-bold active:from-red-600 active:to-rose-700 sm:hover:from-red-600 sm:hover:to-rose-700 transition-all shadow-lg shadow-red-500/30 text-sm sm:text-base"
              >
                Submit Report
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer with Version Info */}
      <footer className="bg-white/50 backdrop-blur-sm border-t border-gray-200/50 py-3 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-xs text-gray-400">
            Version {versionInfo.version} · Last Updated: {versionInfo.lastUpdated} · {versionInfo.repository}
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
