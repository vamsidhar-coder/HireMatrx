// ========== GLOBAL STATE ==========
let currentUser = null;
let applications = [];
let nextTrackingId = 1001;
let selectedJobDetails = null;
let userResumeData = null;

// Recruiter state
let recruiterJobs = [];
let recruiterCandidates = [];
let selectedFiles = [];

// Mock user data for demo
const mockUser = {
    name: "Vamsi Krishna",
    email: "vamsi@student.edu",
    type: "student",
    resumeScore: 68,
    atsScore: 62,
    readinessScore: 58,
    probabilityScore: 45,
    skills: {
        python: 65,
        dsa: 55,
        sql: 70,
        communication: 80,
        systemDesign: 30,
        docker: 20,
        aws: 15,
        javascript: 60,
        react: 45,
        nodejs: 40
    },
    missingSkills: ['System Design', 'Docker', 'AWS', 'TypeScript'],
    targetRole: 'Software Engineer',
    recommendedCourses: [
        'System Design Interview Course',
        'Docker Mastery Course',
        'AWS Certified Solutions Architect'
    ]
};

// Recruiter mock data
const mockRecruiter = {
    company: "TechCorp India",
    email: "recruiting@techcorp.com",
    name: "HR Team",
    type: "recruiter"
};

// Mock companies data for suggested companies (kept for student view)
const mockCompanies = [
    {
        id: 1,
        name: "Google",
        role: "SDE Intern",
        match: 78,
        location: "Bangalore",
        salary: "₹60K/month",
        readiness: 72,
        skills: ["Python", "DSA", "System Design"],
        type: "full-time"
    },
    {
        id: 2,
        name: "Microsoft",
        role: "Software Engineer",
        match: 75,
        location: "Hyderabad",
        salary: "₹25 LPA",
        readiness: 70,
        skills: ["C#", "Azure", "DSA"],
        type: "full-time"
    }
];

// Mock internships data
const mockInternships = [
    {
        id: 101,
        name: "Google",
        role: "Software Engineering Intern",
        match: 82,
        location: "Remote",
        salary: "₹55K/month",
        duration: "6 months",
        skills: ["Python", "DSA", "System Design"]
    }
];

// ========== DOM ELEMENTS ==========
document.addEventListener('DOMContentLoaded', function() {
    // Get DOM elements
    const getStartedBtn = document.getElementById('getStartedBtn');
    const loginModal = document.getElementById('loginModal');
    const closeModalBtn = document.getElementById('closeModalBtn');
    const mainDashboard = document.getElementById('mainDashboard');
    const hero = document.querySelector('.hero');
    const confirmModal = document.getElementById('confirmModal');
    const trackingModal = document.getElementById('trackingModal');
    const cancelConfirm = document.getElementById('cancelConfirm');
    const acceptConfirm = document.getElementById('acceptConfirm');
    const closeTrackingModal = document.getElementById('closeTrackingModal');
    
    // Job role modal elements
    const jobRoleModal = document.getElementById('jobRoleModal');
    const companySelect = document.getElementById('companySelect');
    const roleSelect = document.getElementById('roleSelect');
    const targetCtc = document.getElementById('targetCtc');
    const confirmJobRoleBtn = document.getElementById('confirmJobRoleBtn');
    const cancelJobRoleBtn = document.getElementById('cancelJobRoleBtn');
    const closeJobRoleModal = document.getElementById('closeJobRoleModal');
    
    // Resume upload elements
    const resumeUpload = document.getElementById('resumeUpload');
    const uploadArea = document.getElementById('uploadArea');
    
    // Login tab elements
    const studentTabBtn = document.getElementById('studentTabBtn');
    const recruiterTabBtn = document.getElementById('recruiterTabBtn');
    const studentLoginOptions = document.getElementById('studentLoginOptions');
    const recruiterLoginOptions = document.getElementById('recruiterLoginOptions');
    
    // Login buttons
    const studentGoogleBtn = document.getElementById('studentGoogleBtn');
    const studentMicrosoftBtn = document.getElementById('studentMicrosoftBtn');
    const studentEmailBtn = document.getElementById('studentEmailBtn');
    const recruiterCompanyBtn = document.getElementById('recruiterCompanyBtn');
    const recruiterMicrosoftBtn = document.getElementById('recruiterMicrosoftBtn');
    const recruiterEmailBtn = document.getElementById('recruiterEmailBtn');
    const createCompanyLink = document.getElementById('createCompanyLink');
    
    // Navigation items
    const navItems = document.querySelectorAll('.nav-item');
    
    // Settings elements
    const logoutBtn = document.getElementById('logoutBtn');
    const termsBtn = document.getElementById('termsBtn');
    const privacyBtn = document.getElementById('privacyBtn');
    const rateUsBtn = document.getElementById('rateUsBtn');
    const shareBtn = document.getElementById('shareBtn');
    const emailNotifications = document.getElementById('emailNotifications');
    const pushNotifications = document.getElementById('pushNotifications');
    const appUpdates = document.getElementById('appUpdates');
    
    // Profile elements
    const profileName = document.getElementById('profileName');
    const profileEmail = document.getElementById('profileEmail');
    
    // Recruiter elements
    const postJobBtn = document.getElementById('postJobBtn');
    const clearJobForm = document.getElementById('clearJobForm');
    const bulkUploadArea = document.getElementById('bulkUploadArea');
    const bulkResumeUpload = document.getElementById('bulkResumeUpload');
    const processBulkUpload = document.getElementById('processBulkUpload');
    const bulkJobSelect = document.getElementById('bulkJobSelect');
    
    // Candidates modal
    const candidatesModal = document.getElementById('candidatesModal');
    const closeCandidatesModal = document.getElementById('closeCandidatesModal');
    const closeCandidatesModalBtn = document.getElementById('closeCandidatesModalBtn');
    const candidateSearch = document.getElementById('candidateSearch');
    const candidateFilter = document.getElementById('candidateFilter');
    
    // ========== INITIALIZATION ==========
    if (mainDashboard) mainDashboard.style.display = 'none';
    if (hero) hero.style.display = 'flex';
    
    loadApplications();
    loadRecruiterData();
    updateApplicationsTable();
    
    // Set initial user to null (not logged in)
    currentUser = null;
    
    // ========== MODAL FUNCTIONS ==========
    function showModal(modal) {
        if (modal) modal.style.display = 'flex';
    }
    
    function hideModal(modal) {
        if (modal) modal.style.display = 'none';
    }
    
    // ========== NOTIFICATION FUNCTION ==========
    function showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'}"></i>
                <span>${message}</span>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 3000);
    }
    
    // ========== LOGIN TAB SWITCHING ==========
    if (studentTabBtn && recruiterTabBtn) {
        studentTabBtn.addEventListener('click', function() {
            studentTabBtn.style.background = '#0A84FF';
            studentTabBtn.style.color = '#FFFFFF';
            recruiterTabBtn.style.background = 'transparent';
            recruiterTabBtn.style.color = '#A1A1A6';
            
            if (studentLoginOptions) studentLoginOptions.style.display = 'block';
            if (recruiterLoginOptions) recruiterLoginOptions.style.display = 'none';
        });
        
        recruiterTabBtn.addEventListener('click', function() {
            recruiterTabBtn.style.background = '#0A84FF';
            recruiterTabBtn.style.color = '#FFFFFF';
            studentTabBtn.style.background = 'transparent';
            studentTabBtn.style.color = '#A1A1A6';
            
            if (recruiterLoginOptions) recruiterLoginOptions.style.display = 'block';
            if (studentLoginOptions) studentLoginOptions.style.display = 'none';
        });
    }
    
    // ========== GET STARTED BUTTON ==========
    if (getStartedBtn) {
        getStartedBtn.addEventListener('click', function() {
            showModal(loginModal);
        });
    }
    
    // ========== CLOSE MODAL BUTTONS ==========
    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', function() {
            hideModal(loginModal);
        });
    }
    
    if (closeJobRoleModal) {
        closeJobRoleModal.addEventListener('click', function() {
            hideModal(jobRoleModal);
        });
    }
    
    // ========== CLOSE MODALS ON OVERLAY CLICK ==========
    if (loginModal) {
        loginModal.addEventListener('click', function(e) {
            if (e.target === loginModal) hideModal(loginModal);
        });
    }
    
    if (jobRoleModal) {
        jobRoleModal.addEventListener('click', function(e) {
            if (e.target === jobRoleModal) hideModal(jobRoleModal);
        });
    }
    
    if (confirmModal) {
        confirmModal.addEventListener('click', function(e) {
            if (e.target === confirmModal) hideModal(confirmModal);
        });
    }
    
    if (trackingModal) {
        trackingModal.addEventListener('click', function(e) {
            if (e.target === trackingModal) hideModal(trackingModal);
        });
    }
    
    if (candidatesModal) {
        candidatesModal.addEventListener('click', function(e) {
            if (e.target === candidatesModal) hideModal(candidatesModal);
        });
    }
    
    // ========== STUDENT LOGIN ==========
    function studentLogin() {
        currentUser = JSON.parse(JSON.stringify(mockUser));
        
        if (hero) hero.style.display = 'none';
        hideModal(loginModal);
        
        if (mainDashboard) mainDashboard.style.display = 'flex';
        
        // Show all navigation items for student
        document.querySelectorAll('.nav-item').forEach(item => {
            if (item.getAttribute('data-section') !== 'recruiter') {
                item.style.display = 'flex';
            } else {
                item.style.display = 'none';
            }
        });
        
        // Activate dashboard section
        document.querySelectorAll('.nav-item').forEach(nav => nav.classList.remove('active'));
        const dashboardNav = document.querySelector('[data-section="dashboard"]');
        if (dashboardNav) dashboardNav.classList.add('active');
        
        document.querySelectorAll('.content-section').forEach(section => section.classList.remove('active'));
        const dashboardSection = document.getElementById('dashboard-section');
        if (dashboardSection) dashboardSection.classList.add('active');
        
        updateDashboardData();
        updateSkillGapSection();
        updateProfileInfo();
        
        showNotification('Successfully signed in as Student!', 'success');
    }
    
    if (studentGoogleBtn) studentGoogleBtn.addEventListener('click', studentLogin);
    if (studentMicrosoftBtn) studentMicrosoftBtn.addEventListener('click', studentLogin);
    if (studentEmailBtn) studentEmailBtn.addEventListener('click', studentLogin);
    
    // ========== RECRUITER LOGIN ==========
    function recruiterLogin() {
        currentUser = JSON.parse(JSON.stringify(mockRecruiter));
        
        if (hero) hero.style.display = 'none';
        hideModal(loginModal);
        
        if (mainDashboard) mainDashboard.style.display = 'flex';
        
        // Hide all student-specific navigation items
        document.querySelectorAll('.nav-item').forEach(item => {
            const section = item.getAttribute('data-section');
            if (section === 'profile' || section === 'recruiter' || section === 'settings') {
                item.style.display = 'flex';
            } else {
                item.style.display = 'none';
            }
        });
        
        // Switch to recruiter section
        document.querySelectorAll('.nav-item').forEach(nav => nav.classList.remove('active'));
        const recruiterNav = document.querySelector('[data-section="recruiter"]');
        if (recruiterNav) recruiterNav.classList.add('active');
        
        document.querySelectorAll('.content-section').forEach(section => section.classList.remove('active'));
        const recruiterSection = document.getElementById('recruiter-section');
        if (recruiterSection) recruiterSection.classList.add('active');
        
        updateRecruiterDashboard();
        updateProfileInfo();
        showNotification('Successfully signed in as Recruiter!', 'success');
    }
    
    if (recruiterCompanyBtn) recruiterCompanyBtn.addEventListener('click', recruiterLogin);
    if (recruiterMicrosoftBtn) recruiterMicrosoftBtn.addEventListener('click', recruiterLogin);
    if (recruiterEmailBtn) recruiterEmailBtn.addEventListener('click', recruiterLogin);
    
    if (createCompanyLink) {
        createCompanyLink.addEventListener('click', function(e) {
            e.preventDefault();
            showNotification('Company registration form would open here', 'info');
        });
    }
    
    // ========== NAVIGATION ==========
    navItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            
            navItems.forEach(nav => nav.classList.remove('active'));
            this.classList.add('active');
            
            const section = this.getAttribute('data-section');
            
            document.querySelectorAll('.content-section').forEach(section => {
                section.classList.remove('active');
            });
            
            const targetSection = document.getElementById(`${section}-section`);
            if (targetSection) {
                targetSection.classList.add('active');
                
                if (section === 'profile') {
                    updateProfileInfo();
                } else if (section === 'recruiter') {
                    updateRecruiterDashboard();
                }
            }
        });
    });
    
    // ========== UPDATE DASHBOARD DATA ==========
    function updateDashboardData() {
        if (!currentUser) return;
        
        const statValues = document.querySelectorAll('.stat-value');
        if (statValues.length >= 4) {
            statValues[0].innerHTML = currentUser.resumeScore;
            statValues[1].innerHTML = currentUser.atsScore;
            statValues[2].innerHTML = currentUser.readinessScore;
            statValues[3].innerHTML = currentUser.probabilityScore + '<span class="stat-unit">%</span>';
        }
    }
    
    // ========== UPDATE SKILL GAP SECTION ==========
    function updateSkillGapSection() {
        if (!currentUser) return;
        
        const missingList = document.getElementById('missingSkillsList');
        const requiredList = document.getElementById('requiredSkillsList');
        const suggestionsList = document.getElementById('improvementSuggestionsList');
        
        if (missingList) {
            const missingSkills = currentUser.missingSkills || ['System Design', 'Docker', 'AWS'];
            let missingHtml = '';
            missingSkills.forEach(skill => {
                missingHtml += `<li>${skill}</li>`;
            });
            missingList.innerHTML = missingHtml;
        }
        
        if (requiredList) {
            const requiredSkills = [
                'Python (Advanced)',
                'Data Structures',
                'SQL Optimization',
                'System Design'
            ];
            let requiredHtml = '';
            requiredSkills.forEach(skill => {
                requiredHtml += `<li>${skill}</li>`;
            });
            requiredList.innerHTML = requiredHtml;
        }
        
        if (suggestionsList) {
            const suggestions = currentUser.recommendedCourses || [
                'Take System Design course',
                'Build a microservices project',
                'Practice LeetCode medium'
            ];
            let suggestionsHtml = '';
            suggestions.forEach(suggestion => {
                suggestionsHtml += `<li>${suggestion}</li>`;
            });
            suggestionsList.innerHTML = suggestionsHtml;
        }
    }
    
    // ========== UPDATE PROFILE INFO ==========
    function updateProfileInfo() {
        if (!currentUser) return;
        
        if (profileName) profileName.textContent = currentUser.name || currentUser.name || 'HR Team';
        if (profileEmail) profileEmail.textContent = currentUser.email;
        
        // Update profile stats based on user type
        const profileStats = document.querySelector('.profile-stats');
        if (profileStats) {
            if (currentUser.type === 'recruiter') {
                profileStats.innerHTML = `
                    <div class="profile-stat-card">
                        <h3>Company</h3>
                        <p>${currentUser.company || 'TechCorp India'}</p>
                    </div>
                    <div class="profile-stat-card">
                        <h3>Active Jobs</h3>
                        <p>${recruiterJobs.length}</p>
                    </div>
                    <div class="profile-stat-card">
                        <h3>Total Candidates</h3>
                        <p>${recruiterCandidates.length}</p>
                    </div>
                `;
            } else {
                profileStats.innerHTML = `
                    <div class="profile-stat-card">
                        <h3>Education</h3>
                        <p>B.Tech Computer Science</p>
                        <p>CGPA: 8.5/10</p>
                    </div>
                    <div class="profile-stat-card">
                        <h3>Experience</h3>
                        <p>2 Internships</p>
                        <p>3 Projects</p>
                    </div>
                    <div class="profile-stat-card">
                        <h3>Preferences</h3>
                        <p>Software Engineer</p>
                        <p>Bangalore, Hyderabad</p>
                    </div>
                `;
            }
        }
    }
    
    // ========== ANALYZE RESUME FUNCTION ==========
    function analyzeResume(jobDetails) {
        if (!currentUser) return;
        
        const role = jobDetails.role;
        const company = jobDetails.company;
        
        let scoreImprovement = Math.floor(Math.random() * 15) + 10;
        let atsImprovement = Math.floor(Math.random() * 12) + 8;
        
        if (role.includes('Data') || role.includes('Analyst')) {
            currentUser.skills.python = Math.min(95, currentUser.skills.python + 15);
            currentUser.skills.sql = Math.min(95, currentUser.skills.sql + 12);
            currentUser.skills.dsa = Math.min(90, currentUser.skills.dsa + 8);
            
            currentUser.missingSkills = ['Tableau', 'Power BI', 'Statistics', 'Machine Learning Basics'];
            currentUser.recommendedCourses = [
                'Data Visualization with Tableau',
                'SQL for Data Analysis',
                'Statistics for Data Science',
                'Machine Learning Fundamentals'
            ];
        } 
        else if (role.includes('Frontend')) {
            currentUser.skills.javascript = Math.min(95, (currentUser.skills.javascript || 60) + 18);
            currentUser.skills.react = Math.min(90, (currentUser.skills.react || 45) + 20);
            
            currentUser.missingSkills = ['TypeScript', 'Next.js', 'CSS Frameworks', 'Web Performance'];
            currentUser.recommendedCourses = [
                'Advanced TypeScript',
                'React Performance Optimization',
                'Modern CSS with Tailwind',
                'Next.js Mastery'
            ];
        }
        else if (role.includes('Backend') || role.includes('Engineer')) {
            currentUser.skills.python = Math.min(95, currentUser.skills.python + 12);
            currentUser.skills.dsa = Math.min(90, currentUser.skills.dsa + 15);
            currentUser.skills.systemDesign = Math.min(80, (currentUser.skills.systemDesign || 30) + 25);
            currentUser.skills.docker = Math.min(75, (currentUser.skills.docker || 20) + 30);
            currentUser.skills.aws = Math.min(70, (currentUser.skills.aws || 15) + 25);
            
            currentUser.missingSkills = ['System Design', 'Docker', 'Kubernetes', 'AWS', 'Microservices'];
            currentUser.recommendedCourses = [
                'Grokking System Design Interview',
                'Docker and Kubernetes Mastery',
                'AWS Certified Solutions Architect',
                'Microservices with Node.js'
            ];
        }
        else {
            currentUser.skills.python = Math.min(90, currentUser.skills.python + 10);
            currentUser.skills.dsa = Math.min(85, currentUser.skills.dsa + 12);
            currentUser.skills.sql = Math.min(90, currentUser.skills.sql + 8);
        }
        
        currentUser.resumeScore = Math.min(98, currentUser.resumeScore + scoreImprovement);
        currentUser.atsScore = Math.min(95, currentUser.atsScore + atsImprovement);
        currentUser.readinessScore = Math.min(92, currentUser.readinessScore + 12);
        
        const avgScore = (currentUser.resumeScore + currentUser.atsScore + currentUser.readinessScore) / 3;
        currentUser.probabilityScore = Math.min(85, Math.floor(avgScore * 0.9));
        
        if (company === 'Google' || company === 'Microsoft' || company === 'Amazon') {
            currentUser.probabilityScore = Math.min(88, currentUser.probabilityScore + 5);
        }
        
        currentUser.targetRole = role;
        
        userResumeData = {
            analyzed: true,
            timestamp: new Date().toISOString(),
            jobDetails: jobDetails
        };
    }
    
    // ========== JOB ROLE MODAL ==========
    if (uploadArea) {
        uploadArea.addEventListener('click', function() {
            if (!currentUser) {
                showModal(loginModal);
                return;
            }
            
            if (companySelect) companySelect.value = '';
            if (roleSelect) roleSelect.value = '';
            if (targetCtc) targetCtc.value = '';
            
            if (companySelect) companySelect.classList.remove('error');
            if (roleSelect) roleSelect.classList.remove('error');
            
            showModal(jobRoleModal);
        });
    }
    
    if (cancelJobRoleBtn) {
        cancelJobRoleBtn.addEventListener('click', function() {
            hideModal(jobRoleModal);
        });
    }
    
    if (confirmJobRoleBtn) {
        confirmJobRoleBtn.addEventListener('click', function() {
            let isValid = true;
            
            if (!companySelect || !companySelect.value) {
                if (companySelect) companySelect.classList.add('error');
                showNotification('Please select a company', 'error');
                isValid = false;
            } else {
                if (companySelect) companySelect.classList.remove('error');
            }
            
            if (!roleSelect || !roleSelect.value) {
                if (roleSelect) roleSelect.classList.add('error');
                showNotification('Please select a job role', 'error');
                isValid = false;
            } else {
                if (roleSelect) roleSelect.classList.remove('error');
            }
            
            if (isValid) {
                selectedJobDetails = {
                    company: companySelect.value,
                    role: roleSelect.value,
                    ctc: targetCtc ? targetCtc.value || 'Not specified' : 'Not specified'
                };
                
                hideModal(jobRoleModal);
                
                setTimeout(() => {
                    if (resumeUpload) resumeUpload.click();
                }, 300);
            }
        });
    }
    
    if (companySelect) {
        companySelect.addEventListener('change', function() {
            this.classList.remove('error');
        });
    }
    
    if (roleSelect) {
        roleSelect.addEventListener('change', function() {
            this.classList.remove('error');
        });
    }
    
    // ========== RESUME UPLOAD ==========
    if (resumeUpload) {
        resumeUpload.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (file && selectedJobDetails) {
                const jobInfo = ` for ${selectedJobDetails.role} at ${selectedJobDetails.company}`;
                
                showNotification(`Resume uploaded${jobInfo}! Analyzing with AI...`, 'info');
                
                setTimeout(() => {
                    analyzeResume(selectedJobDetails);
                    
                    updateDashboardData();
                    updateSkillGapSection();
                    
                    createApplicationFromJobDetails();
                    
                    const improvements = currentUser.resumeScore - 68;
                    showNotification(`✨ Resume analyzed! Scores improved by ${improvements}%! Check your dashboard.`, 'success');
                    
                    navItems.forEach(nav => {
                        if (nav.getAttribute('data-section') === 'dashboard') {
                            nav.click();
                        }
                    });
                    
                    selectedJobDetails = null;
                }, 2500);
            }
        });
    }
    
    // ========== CREATE APPLICATION ==========
    function createApplicationFromJobDetails() {
        if (!selectedJobDetails) return;
        
        const application = {
            id: `HM${nextTrackingId++}`,
            company: selectedJobDetails.company,
            role: selectedJobDetails.role,
            status: 'Resume Uploaded',
            date: new Date().toLocaleDateString('en-IN'),
            lastUpdated: 'Just now',
            ctc: selectedJobDetails.ctc,
            resumeScore: currentUser?.resumeScore || 0
        };
        
        applications.push(application);
        saveApplications();
        updateApplicationsTable();
    }
    
    // ========== APPLICATIONS TABLE ==========
    function updateApplicationsTable() {
        const tbody = document.getElementById('applicationsBody');
        if (!tbody) return;
        
        if (applications.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="5" style="text-align: center; color: #A1A1A6; padding: 40px;">
                        No applications yet. Upload your resume with job details to track them here.
                    </td>
                </tr>
            `;
            return;
        }
        
        let html = '';
        applications.forEach(app => {
            const statusClass = app.status.toLowerCase().replace(/ /g, '-');
            html += `
                <tr>
                    <td>${app.company}</td>
                    <td>${app.role}</td>
                    <td>${app.id}</td>
                    <td><span class="status-badge ${statusClass}">${app.status}</span></td>
                    <td>${app.lastUpdated}</td>
                </tr>
            `;
        });
        
        tbody.innerHTML = html;
    }
    
    // ========== LOCAL STORAGE ==========
    function saveApplications() {
        localStorage.setItem('hm_applications', JSON.stringify(applications));
        localStorage.setItem('hm_nextId', nextTrackingId);
    }
    
    function loadApplications() {
        const saved = localStorage.getItem('hm_applications');
        if (saved) applications = JSON.parse(saved);
        
        const savedId = localStorage.getItem('hm_nextId');
        if (savedId) nextTrackingId = parseInt(savedId);
    }
    
    // ========== RECRUITER FUNCTIONS ==========
    
    // Post new job
    if (postJobBtn) {
        postJobBtn.addEventListener('click', function() {
            const jobTitle = document.getElementById('jobTitle').value;
            const companyName = document.getElementById('companyName').value;
            
            if (!jobTitle || !companyName) {
                showNotification('Please fill in required fields (Job Title and Company Name)', 'error');
                return;
            }
            
            const skillsInput = document.getElementById('jobSkills').value;
            const skillsArray = skillsInput ? skillsInput.split(',').map(s => s.trim()).filter(s => s) : [];
            
            const newJob = {
                id: 'JOB' + Math.floor(Math.random() * 10000),
                title: jobTitle,
                company: companyName,
                location: document.getElementById('jobLocation').value || 'Not specified',
                type: document.getElementById('employmentType').value,
                experience: document.getElementById('experienceReq').value || 'Not specified',
                salary: document.getElementById('salaryRange').value || 'Not specified',
                description: document.getElementById('jobDescription').value || 'No description provided',
                skills: skillsArray,
                postedDate: new Date().toLocaleDateString('en-IN'),
                applicants: 0,
                candidates: []
            };
            
            recruiterJobs.push(newJob);
            saveRecruiterData();
            updateRecruiterDashboard();
            
            // Clear form
            document.getElementById('jobTitle').value = '';
            document.getElementById('jobLocation').value = '';
            document.getElementById('jobDescription').value = '';
            document.getElementById('jobSkills').value = '';
            document.getElementById('experienceReq').value = '';
            document.getElementById('salaryRange').value = '';
            document.getElementById('employmentType').value = 'Full-time';
            
            showNotification('Job posted successfully!', 'success');
        });
    }
    
    // Clear job form
    if (clearJobForm) {
        clearJobForm.addEventListener('click', function() {
            document.getElementById('jobTitle').value = '';
            document.getElementById('jobLocation').value = '';
            document.getElementById('jobDescription').value = '';
            document.getElementById('jobSkills').value = '';
            document.getElementById('experienceReq').value = '';
            document.getElementById('salaryRange').value = '';
            document.getElementById('employmentType').value = 'Full-time';
        });
    }
    
    // Bulk resume upload
    if (bulkUploadArea) {
        bulkUploadArea.addEventListener('click', function() {
            if (bulkResumeUpload) bulkResumeUpload.click();
        });
    }
    
    if (bulkResumeUpload) {
        bulkResumeUpload.addEventListener('change', function(e) {
            selectedFiles = Array.from(e.target.files);
            
            const selectedCount = document.getElementById('selectedFilesCount');
            const progressBar = document.getElementById('uploadProgressBar');
            const progressPercent = document.getElementById('uploadProgressPercent');
            
            if (selectedCount) selectedCount.textContent = selectedFiles.length;
            if (progressBar) progressBar.style.width = '0%';
            if (progressPercent) progressPercent.textContent = '0%';
            
            // Update files list
            const filesList = document.getElementById('uploadedFilesList');
            if (filesList) {
                if (selectedFiles.length > 0) {
                    let html = '<h4 style="color: #FFFFFF; margin-bottom: 10px;">Selected Files:</h4>';
                    selectedFiles.forEach((file, index) => {
                        const fileSize = (file.size / 1024).toFixed(1);
                        html += `<p style="color: #A1A1A6; font-size: 12px; margin-bottom: 5px;">
                            <i class="fas fa-file-pdf" style="color: #FF453A; margin-right: 5px;"></i>
                            ${file.name} (${fileSize} KB)
                        </p>`;
                    });
                    filesList.innerHTML = html;
                } else {
                    filesList.innerHTML = '<p style="color: #A1A1A6;">No files selected</p>';
                }
            }
            
            // Enable/disable process button
            if (processBulkUpload) {
                processBulkUpload.disabled = selectedFiles.length === 0;
            }
        });
    }
    
    // Update job dropdown for bulk upload
    function updateJobDropdown() {
        if (!bulkJobSelect) return;
        
        let options = '<option value="">Select Job for these applications</option>';
        recruiterJobs.forEach(job => {
            options += `<option value="${job.id}">${job.title} at ${job.company}</option>`;
        });
        bulkJobSelect.innerHTML = options;
    }
    
    // Process bulk upload
    if (processBulkUpload) {
        processBulkUpload.addEventListener('click', function() {
            const selectedJobId = bulkJobSelect.value;
            
            if (!selectedJobId) {
                showNotification('Please select a job for these applications', 'error');
                return;
            }
            
            if (selectedFiles.length === 0) {
                showNotification('Please select files to upload', 'error');
                return;
            }
            
            // Simulate upload progress
            let progress = 0;
            const interval = setInterval(() => {
                progress += 10;
                const progressBar = document.getElementById('uploadProgressBar');
                const progressPercent = document.getElementById('uploadProgressPercent');
                
                if (progressBar) progressBar.style.width = progress + '%';
                if (progressPercent) progressPercent.textContent = progress + '%';
                
                if (progress >= 100) {
                    clearInterval(interval);
                    
                    // Generate candidates from uploaded files
                    const job = recruiterJobs.find(j => j.id === selectedJobId);
                    if (job) {
                        selectedFiles.forEach(file => {
                            // Extract name from filename
                            let name = file.name.replace('.pdf', '').replace('.docx', '').replace(/_/g, ' ').replace(/-/g, ' ');
                            // Capitalize words
                            name = name.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ');
                            
                            const candidate = {
                                id: 'CAN' + Math.floor(Math.random() * 10000),
                                jobId: selectedJobId,
                                name: name,
                                email: name.toLowerCase().replace(/ /g, '.') + '@example.com',
                                experience: Math.floor(Math.random() * 8) + 1 + ' years',
                                matchScore: Math.floor(Math.random() * 40) + 60,
                                status: 'pending',
                                fileName: file.name,
                                uploadDate: new Date().toLocaleDateString('en-IN')
                            };
                            
                            recruiterCandidates.push(candidate);
                            if (!job.candidates) job.candidates = [];
                            job.candidates.push(candidate);
                            job.applicants = (job.applicants || 0) + 1;
                        });
                        
                        saveRecruiterData();
                        updateRecruiterDashboard();
                        
                        showNotification(`Successfully uploaded ${selectedFiles.length} resumes for ${job.title}!`, 'success');
                        
                        // Reset upload area
                        selectedFiles = [];
                        const selectedCount = document.getElementById('selectedFilesCount');
                        const filesList = document.getElementById('uploadedFilesList');
                        const progressBar = document.getElementById('uploadProgressBar');
                        const progressPercent = document.getElementById('uploadProgressPercent');
                        
                        if (selectedCount) selectedCount.textContent = '0';
                        if (filesList) filesList.innerHTML = '<p style="color: #A1A1A6;">No files selected</p>';
                        if (progressBar) progressBar.style.width = '0%';
                        if (progressPercent) progressPercent.textContent = '0%';
                        if (bulkResumeUpload) bulkResumeUpload.value = '';
                        if (processBulkUpload) processBulkUpload.disabled = true;
                        if (bulkJobSelect) bulkJobSelect.value = '';
                    }
                }
            }, 200);
        });
    }
    
    // View candidates function
    window.viewCandidates = function(jobId) {
        const job = recruiterJobs.find(j => j.id === jobId);
        if (!job) return;
        
        const modalTitle = document.getElementById('candidatesModalTitle');
        if (modalTitle) modalTitle.textContent = `Candidates for ${job.title} at ${job.company}`;
        
        const candidates = recruiterCandidates.filter(c => c.jobId === jobId);
        const tbody = document.getElementById('candidatesTableBody');
        
        if (tbody) {
            if (candidates.length === 0) {
                tbody.innerHTML = `<tr><td colspan="6" style="text-align: center; color: #A1A1A6; padding: 40px;">No candidates yet</td></tr>`;
            } else {
                let html = '';
                candidates.forEach(candidate => {
                    const matchColor = candidate.matchScore > 80 ? '#30D158' : candidate.matchScore > 60 ? '#FFD60A' : '#FF453A';
                    html += `
                        <tr>
                            <td>${candidate.name}</td>
                            <td>${candidate.email}</td>
                            <td>${candidate.experience}</td>
                            <td>
                                <span style="color: ${matchColor}; font-weight: 600;">
                                    ${candidate.matchScore}%
                                </span>
                            </td>
                            <td>
                                <span class="status-badge ${candidate.status}">${candidate.status}</span>
                            </td>
                            <td>
                                <button class="action-btn" onclick="updateCandidateStatus('${candidate.id}', 'shortlisted')">
                                    <i class="fas fa-check"></i>
                                </button>
                                <button class="action-btn" onclick="updateCandidateStatus('${candidate.id}', 'rejected')">
                                    <i class="fas fa-times"></i>
                                </button>
                                <button class="action-btn" onclick="viewResume('${candidate.fileName}')">
                                    <i class="fas fa-eye"></i>
                                </button>
                            </td>
                        </tr>
                    `;
                });
                tbody.innerHTML = html;
            }
        }
        
        showModal(candidatesModal);
    };
    
    // Update candidate status
    window.updateCandidateStatus = function(candidateId, status) {
        const candidate = recruiterCandidates.find(c => c.id === candidateId);
        if (candidate) {
            candidate.status = status;
            saveRecruiterData();
            updateRecruiterDashboard();
            showNotification(`Candidate ${status}!`, 'success');
            
            // Refresh current view if modal is open
            if (candidatesModal && candidatesModal.style.display === 'flex') {
                const jobId = candidate.jobId;
                window.viewCandidates(jobId);
            }
        }
    };
    
    // View resume
    window.viewResume = function(fileName) {
        showNotification(`Opening resume: ${fileName}`, 'info');
        // In a real app, this would open the PDF
    };
    
    // Edit job
    window.editJob = function(jobId) {
        const job = recruiterJobs.find(j => j.id === jobId);
        if (job) {
            // Populate form with job details for editing
            document.getElementById('jobTitle').value = job.title;
            document.getElementById('companyName').value = job.company;
            document.getElementById('jobLocation').value = job.location;
            document.getElementById('employmentType').value = job.type;
            document.getElementById('experienceReq').value = job.experience;
            document.getElementById('salaryRange').value = job.salary;
            document.getElementById('jobDescription').value = job.description;
            document.getElementById('jobSkills').value = job.skills.join(', ');
            
            // Scroll to form
            document.getElementById('recruiter-section').scrollIntoView({ behavior: 'smooth' });
            
            showNotification('You can now edit the job details', 'info');
        }
    };
    
    // Close candidates modal
    if (closeCandidatesModal) {
        closeCandidatesModal.addEventListener('click', () => hideModal(candidatesModal));
    }
    if (closeCandidatesModalBtn) {
        closeCandidatesModalBtn.addEventListener('click', () => hideModal(candidatesModal));
    }
    
    // Candidate search and filter
    if (candidateSearch) {
        candidateSearch.addEventListener('input', function() {
            filterCandidates();
        });
    }
    
    if (candidateFilter) {
        candidateFilter.addEventListener('change', function() {
            filterCandidates();
        });
    }
    
    function filterCandidates() {
        if (!candidatesModal || candidatesModal.style.display !== 'flex') return;
        
        const searchTerm = candidateSearch ? candidateSearch.value.toLowerCase() : '';
        const filterStatus = candidateFilter ? candidateFilter.value : 'all';
        
        const jobId = getCurrentJobId();
        if (!jobId) return;
        
        let candidates = recruiterCandidates.filter(c => c.jobId === jobId);
        
        // Apply status filter
        if (filterStatus !== 'all') {
            candidates = candidates.filter(c => c.status === filterStatus);
        }
        
        // Apply search filter
        if (searchTerm) {
            candidates = candidates.filter(c => 
                c.name.toLowerCase().includes(searchTerm) || 
                c.email.toLowerCase().includes(searchTerm)
            );
        }
        
        // Update table
        const tbody = document.getElementById('candidatesTableBody');
        if (tbody) {
            if (candidates.length === 0) {
                tbody.innerHTML = `<tr><td colspan="6" style="text-align: center; color: #A1A1A6; padding: 40px;">No candidates found</td></tr>`;
            } else {
                let html = '';
                candidates.forEach(candidate => {
                    const matchColor = candidate.matchScore > 80 ? '#30D158' : candidate.matchScore > 60 ? '#FFD60A' : '#FF453A';
                    html += `
                        <tr>
                            <td>${candidate.name}</td>
                            <td>${candidate.email}</td>
                            <td>${candidate.experience}</td>
                            <td>
                                <span style="color: ${matchColor}; font-weight: 600;">
                                    ${candidate.matchScore}%
                                </span>
                            </td>
                            <td>
                                <span class="status-badge ${candidate.status}">${candidate.status}</span>
                            </td>
                            <td>
                                <button class="action-btn" onclick="updateCandidateStatus('${candidate.id}', 'shortlisted')">
                                    <i class="fas fa-check"></i>
                                </button>
                                <button class="action-btn" onclick="updateCandidateStatus('${candidate.id}', 'rejected')">
                                    <i class="fas fa-times"></i>
                                </button>
                                <button class="action-btn" onclick="viewResume('${candidate.fileName}')">
                                    <i class="fas fa-eye"></i>
                                </button>
                            </td>
                        </tr>
                    `;
                });
                tbody.innerHTML = html;
            }
        }
    }
    
    function getCurrentJobId() {
        // Get the job ID from the first visible candidate
        if (recruiterCandidates.length > 0) {
            return recruiterCandidates[0].jobId;
        }
        return null;
    }
    
    // Update recruiter dashboard
    function updateRecruiterDashboard() {
        const totalJobsEl = document.getElementById('totalJobs');
        const totalCandidatesEl = document.getElementById('totalCandidates');
        const shortlistedCountEl = document.getElementById('shortlistedCount');
        const pendingReviewEl = document.getElementById('pendingReview');
        
        if (totalJobsEl) totalJobsEl.textContent = recruiterJobs.length;
        if (totalCandidatesEl) totalCandidatesEl.textContent = recruiterCandidates.length;
        if (shortlistedCountEl) shortlistedCountEl.textContent = recruiterCandidates.filter(c => c.status === 'shortlisted').length;
        if (pendingReviewEl) pendingReviewEl.textContent = recruiterCandidates.filter(c => c.status === 'pending').length;
        
        // Update active jobs display
        const jobsContainer = document.getElementById('activeJobsContainer');
        if (jobsContainer) {
            if (recruiterJobs.length === 0) {
                jobsContainer.innerHTML = '<p style="color: #A1A1A6; text-align: center; padding: 40px;">No active job postings. Create your first job posting above!</p>';
            } else {
                let html = '';
                recruiterJobs.forEach(job => {
                    const candidates = recruiterCandidates.filter(c => c.jobId === job.id);
                    const pending = candidates.filter(c => c.status === 'pending').length;
                    const shortlisted = candidates.filter(c => c.status === 'shortlisted').length;
                    
                    html += `
                        <div class="job-card">
                            <div class="job-header">
                                <div>
                                    <h3 class="job-title">${job.title}</h3>
                                    <div class="job-company">${job.company}</div>
                                </div>
                                <span class="job-badge">${job.type}</span>
                            </div>
                            
                            <div class="job-details">
                                <div class="job-detail-item">
                                    <i class="fas fa-map-marker-alt"></i>
                                    <span>${job.location}</span>
                                </div>
                                <div class="job-detail-item">
                                    <i class="fas fa-briefcase"></i>
                                    <span>Exp: ${job.experience}</span>
                                </div>
                                <div class="job-detail-item">
                                    <i class="fas fa-money-bill-alt"></i>
                                    <span>${job.salary}</span>
                                </div>
                            </div>
                            
                            <div class="job-skills">
                                ${job.skills.map(skill => `<span class="skill-tag">${skill}</span>`).join('')}
                            </div>
                            
                            <div class="job-stats">
                                <span class="applicant-count">
                                    <i class="fas fa-users"></i> ${candidates.length} Applicants
                                </span>
                                <span style="color: #FFD60A;">
                                    <i class="fas fa-clock"></i> ${pending} Pending
                                </span>
                                <span style="color: #30D158;">
                                    <i class="fas fa-check-circle"></i> ${shortlisted} Shortlisted
                                </span>
                            </div>
                            
                            <div style="display: flex; gap: 10px; margin-top: 15px;">
                                <button class="modal-btn primary" style="flex: 1; padding: 8px;" onclick="viewCandidates('${job.id}')">
                                    View Candidates (${candidates.length})
                                </button>
                                <button class="modal-btn secondary" style="padding: 8px;" onclick="editJob('${job.id}')">
                                    <i class="fas fa-edit"></i>
                                </button>
                            </div>
                        </div>
                    `;
                });
                jobsContainer.innerHTML = html;
            }
        }
        
        // Update job dropdown for bulk upload
        updateJobDropdown();
    }
    
    // Save/load recruiter data
    function saveRecruiterData() {
        localStorage.setItem('hm_recruiter_jobs', JSON.stringify(recruiterJobs));
        localStorage.setItem('hm_recruiter_candidates', JSON.stringify(recruiterCandidates));
    }
    
    function loadRecruiterData() {
        const savedJobs = localStorage.getItem('hm_recruiter_jobs');
        const savedCandidates = localStorage.getItem('hm_recruiter_candidates');
        
        if (savedJobs) recruiterJobs = JSON.parse(savedJobs);
        if (savedCandidates) recruiterCandidates = JSON.parse(savedCandidates);
    }
    
    // ========== SETTINGS EVENT LISTENERS ==========
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function() {
            currentUser = null;
            userResumeData = null;
            
            if (mainDashboard) mainDashboard.style.display = 'none';
            if (hero) hero.style.display = 'flex';
            
            // Show all navigation items again (for next login)
            document.querySelectorAll('.nav-item').forEach(item => {
                item.style.display = 'flex';
            });
            
            showNotification('Logged out successfully', 'success');
        });
    }
    
    if (termsBtn) {
        termsBtn.addEventListener('click', function() {
            window.open('https://www.example.com/terms', '_blank');
            showNotification('Opening Terms & Conditions', 'info');
        });
    }
    
    if (privacyBtn) {
        privacyBtn.addEventListener('click', function() {
            window.open('https://www.example.com/privacy', '_blank');
            showNotification('Opening Privacy Policy', 'info');
        });
    }
    
    if (rateUsBtn) {
        rateUsBtn.addEventListener('click', function() {
            window.open('https://play.google.com/store/apps', '_blank');
            showNotification('Thank you for rating us! ⭐', 'success');
        });
    }
    
    if (shareBtn) {
        shareBtn.addEventListener('click', function() {
            if (navigator.share) {
                navigator.share({
                    title: 'HireMatrix',
                    text: 'Check out HireMatrix - Smart Career OS for students and recruiters!',
                    url: window.location.href,
                }).then(() => {
                    showNotification('Shared successfully!', 'success');
                }).catch(() => {
                    showNotification('Share cancelled', 'info');
                });
            } else {
                navigator.clipboard.writeText(window.location.href);
                showNotification('Link copied to clipboard!', 'success');
            }
        });
    }
    
    if (emailNotifications) {
        emailNotifications.addEventListener('change', function() {
            showNotification(`Email notifications ${this.checked ? 'enabled' : 'disabled'}`, 'info');
        });
    }
    
    if (pushNotifications) {
        pushNotifications.addEventListener('change', function() {
            showNotification(`Push notifications ${this.checked ? 'enabled' : 'disabled'}`, 'info');
        });
    }
    
    if (appUpdates) {
        appUpdates.addEventListener('change', function() {
            showNotification(`App updates ${this.checked ? 'enabled' : 'disabled'}`, 'info');
        });
    }
    
    // ========== ESCAPE KEY HANDLER ==========
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            if (loginModal && loginModal.style.display === 'flex') hideModal(loginModal);
            if (confirmModal && confirmModal.style.display === 'flex') hideModal(confirmModal);
            if (trackingModal && trackingModal.style.display === 'flex') hideModal(trackingModal);
            if (jobRoleModal && jobRoleModal.style.display === 'flex') hideModal(jobRoleModal);
            if (candidatesModal && candidatesModal.style.display === 'flex') hideModal(candidatesModal);
        }
    });
});

// ========== UTILITY FUNCTIONS ==========
function calculateMatchPercentage() {
    return Math.floor(Math.random() * 30) + 70;
}

function formatINR(amount) {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0
    }).format(amount);
}

// Make functions globally available
window.HireMatrix = {
    calculateMatchPercentage,
    formatINR,
    viewCandidates: window.viewCandidates,
    updateCandidateStatus: window.updateCandidateStatus,
    viewResume: window.viewResume,
    editJob: window.editJob
};