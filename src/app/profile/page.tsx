
const ProfilePage = () => {
    return (
        <div className="flex flex-col flex-1 overflow-hidden">
            {/* Top navigation */}
            <header className="flex items-center justify-between h-16 px-6 bg-white border-b border-gray-200">
                <div className="flex items-center">
                    <button className="md:hidden text-gray-500 focus:outline-none">
                        <i className="fas fa-bars" />
                    </button>
                    <h2 className="ml-4 text-lg font-medium text-gray-800">Profile</h2>
                </div>
                <div className="flex items-center space-x-4">
                    <button className="p-1 text-gray-500 rounded-full focus:outline-none">
                        <i className="fas fa-bell" />
                    </button>
                    <button className="p-1 text-gray-500 rounded-full focus:outline-none">
                        <i className="fas fa-cog" />
                    </button>
                </div>
            </header>
            {/* Main content area */}
            <main className="flex-1 overflow-y-auto p-6 bg-gray-50">
                {/* Profile Header */}
                <div className="ant-card mb-6 bg-white">
                    <div className="p-6">
                        <div className="flex flex-col md:flex-row items-center">
                            <div className="mb-6 md:mb-0 md:mr-8">
                                <img
                                    src="https://avatar.iran.liara.run/public/35"
                                    alt="Profile"
                                    className="profile-photo w-32 h-32 rounded-full object-cover"
                                />
                            </div>
                            <div className="text-center md:text-left">
                                <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
                                    Đặng Anh Tuấn
                                </h1>
                                <p className="text-xl text-blue-600 mb-3">
                                    Information Technology Student
                                </p>
                                <div className="flex justify-center md:justify-start space-x-4">
                                    <a
                                        href="https://github.com/tuan204-dev"
                                        target="_blank"
                                        className="text-gray-600 hover:text-blue-600"
                                    >
                                        <i className="fab fa-github text-2xl" />
                                    </a>
                                    <a
                                        href="mailto:contact.tuandang@gmail.com"
                                        className="text-gray-600 hover:text-blue-600"
                                    >
                                        <i className="fas fa-envelope text-2xl" />
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {/* Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column */}
                    <div className="lg:col-span-1 space-y-6">
                        {/* About Me Card */}
                        <div className="ant-card">
                            <div className="p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-lg font-medium text-gray-900">About Me</h3>
                                    <i className="fas fa-user text-blue-600" />
                                </div>
                                <p className="text-gray-700 mb-4">
                                    Passionate IT student with a focus on web development and cloud
                                    computing. Currently in my third year of studies, I enjoy
                                    solving complex problems and building innovative solutions.
                                </p>
                                <div className="space-y-2">
                                    <div className="flex items-center">
                                        <i className="fas fa-university text-blue-500 mr-2" />
                                        <span className="text-gray-600">
                                            Posts and Telecommunications Institute of Technology
                                        </span>
                                    </div>
                                    <div className="flex items-center">
                                        <i className="fas fa-calendar text-blue-500 mr-2" />
                                        <span className="text-gray-600">
                                            4rd Year (Expected Graduation: 2027)
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* Skills Card */}
                        <div className="ant-card">
                            <div className="p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-lg font-medium text-gray-900">
                                        Technical Skills
                                    </h3>
                                    <i className="fas fa-code text-blue-600" />
                                </div>
                                <div className="space-y-4">
                                    <div>
                                        <h4 className="font-medium text-gray-700 mb-2">
                                            Programming Languages
                                        </h4>
                                        <div className="flex flex-wrap">
                                            <span className="ant-tag ant-tag-blue">JavaScript</span>
                                            <span className="ant-tag ant-tag-green">Python</span>
                                            <span className="ant-tag ant-tag-purple">Java</span>
                                            <span className="ant-tag ant-tag-red">C++</span>
                                            <span className="ant-tag ant-tag-orange">HTML/CSS</span>
                                        </div>
                                    </div>
                                    <div>
                                        <h4 className="font-medium text-gray-700 mb-2">
                                            Frameworks &amp; Libraries
                                        </h4>
                                        <div className="flex flex-wrap">
                                            <span className="ant-tag ant-tag-cyan">React</span>
                                            <span className="ant-tag ant-tag-green">Node.js</span>
                                            <span className="ant-tag ant-tag-blue">Express</span>
                                            <span className="ant-tag ant-tag-purple">Django</span>
                                        </div>
                                    </div>
                                    <div>
                                        <h4 className="font-medium text-gray-700 mb-2">
                                            Tools &amp; Technologies
                                        </h4>
                                        <div className="flex flex-wrap">
                                            <span className="ant-tag ant-tag-orange">Git</span>
                                            <span className="ant-tag ant-tag-red">Docker</span>
                                            <span className="ant-tag ant-tag-blue">AWS</span>
                                            <span className="ant-tag ant-tag-green">MongoDB</span>
                                            <span className="ant-tag ant-tag-purple">MySQL</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* Contact Card */}
                        <div className="ant-card">
                            <div className="p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-lg font-medium text-gray-900">
                                        Contact Me
                                    </h3>
                                    <i className="fas fa-address-book text-blue-600" />
                                </div>
                                <div className="space-y-3">
                                    <a
                                        href="mailto:alex.johnson@example.com"
                                        className="ant-btn flex items-center w-full justify-center"
                                    >
                                        <i className="fas fa-envelope mr-2" />
                                        Email
                                    </a>
                                    <a
                                        href="https://linkedin.com"
                                        target="_blank"
                                        className="ant-btn flex items-center w-full justify-center"
                                    >
                                        <i className="fab fa-linkedin mr-2" />
                                        LinkedIn
                                    </a>
                                    <a
                                        href="https://github.com"
                                        target="_blank"
                                        className="ant-btn flex items-center w-full justify-center"
                                    >
                                        <i className="fab fa-github mr-2" />
                                        GitHub
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* Right Column */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Projects Card */}
                        <div className="ant-card">
                            <div className="p-6">
                                <div className="flex items-center justify-between mb-6">
                                    <h3 className="text-lg font-medium text-gray-900">
                                        Academic Projects
                                    </h3>
                                    <i className="fas fa-project-diagram text-blue-600" />
                                </div>
                                <div className="space-y-0">
                                    {/* Project 1 */}
                                    <div className="ant-list-item">
                                        <div className="flex-1">
                                            <h4 className="text-lg font-medium text-gray-900 mb-2">
                                                E-Learning Platform
                                            </h4>
                                            <p className="text-gray-600 mb-3">
                                                A full-stack web application for online courses with user
                                                authentication, course enrollment, and progress tracking.
                                                Built with React, Node.js, and MongoDB.
                                            </p>
                                            <div className="project-links">
                                                <a href="#">
                                                    <i className="fab fa-github mr-1" /> Code
                                                </a>
                                                <a href="#">
                                                    <i className="fas fa-external-link-alt mr-1" /> Demo
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                    {/* Project 2 */}
                                    <div className="ant-list-item">
                                        <div className="flex-1">
                                            <h4 className="text-lg font-medium text-gray-900 mb-2">
                                                Smart Attendance System
                                            </h4>
                                            <p className="text-gray-600 mb-3">
                                                Facial recognition-based attendance system using Python,
                                                OpenCV, and Firebase. Reduced manual attendance time by
                                                70% in classroom tests.
                                            </p>
                                            <div className="project-links">
                                                <a href="#">
                                                    <i className="fab fa-github mr-1" /> Code
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                    {/* Project 3 */}
                                    <div className="ant-list-item">
                                        <div className="flex-1">
                                            <h4 className="text-lg font-medium text-gray-900 mb-2">
                                                Cloud-Based File Storage
                                            </h4>
                                            <p className="text-gray-600 mb-3">
                                                Secure file storage solution with AWS S3, featuring
                                                encryption, sharing capabilities, and version control.
                                                Implemented with React and Node.js.
                                            </p>
                                            <div className="project-links">
                                                <a href="#">
                                                    <i className="fab fa-github mr-1" /> Code
                                                </a>
                                                <a href="#">
                                                    <i className="fas fa-external-link-alt mr-1" /> Demo
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                    {/* Project 4 */}
                                    <div className="ant-list-item">
                                        <div className="flex-1">
                                            <h4 className="text-lg font-medium text-gray-900 mb-2">
                                                University Event Management
                                            </h4>
                                            <p className="text-gray-600 mb-3">
                                                Django-based platform for university event organization
                                                with calendar integration, ticket sales, and attendance
                                                tracking.
                                            </p>
                                            <div className="project-links">
                                                <a href="#">
                                                    <i className="fab fa-github mr-1" /> Code
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* Achievements Card */}
                        <div className="ant-card">
                            <div className="p-6">
                                <div className="flex items-center justify-between mb-6">
                                    <h3 className="text-lg font-medium text-gray-900">
                                        Achievements &amp; Certificates
                                    </h3>
                                    <i className="fas fa-trophy text-blue-600" />
                                </div>
                                <div className="space-y-0">
                                    {/* Achievement 1 */}
                                    <div className="ant-timeline-item">
                                        <div className="ant-timeline-item-tail" />
                                        <div className="ant-timeline-item-head" />
                                        <div className="ant-timeline-item-content">
                                            <h4 className="font-medium text-gray-900">
                                                AWS Certified Cloud Practitioner
                                            </h4>
                                            <p className="text-gray-500">Amazon Web Services - 2023</p>
                                        </div>
                                    </div>
                                    {/* Achievement 2 */}
                                    <div className="ant-timeline-item">
                                        <div className="ant-timeline-item-tail" />
                                        <div className="ant-timeline-item-head" />
                                        <div className="ant-timeline-item-content">
                                            <h4 className="font-medium text-gray-900">
                                                1st Place - University Hackathon 2022
                                            </h4>
                                            <p className="text-gray-500">
                                                Tech University of Innovation - Developed an AI-powered
                                                campus navigation app
                                            </p>
                                        </div>
                                    </div>
                                    {/* Achievement 3 */}
                                    <div className="ant-timeline-item">
                                        <div className="ant-timeline-item-tail" />
                                        <div className="ant-timeline-item-head" />
                                        <div className="ant-timeline-item-content">
                                            <h4 className="font-medium text-gray-900">
                                                Google IT Support Professional Certificate
                                            </h4>
                                            <p className="text-gray-500">Coursera - 2021</p>
                                        </div>
                                    </div>
                                    {/* Achievement 4 */}
                                    <div className="ant-timeline-item">
                                        <div className="ant-timeline-item-head" />
                                        <div className="ant-timeline-item-content">
                                            <h4 className="font-medium text-gray-900">
                                                Dean&apos;s List - 3 Semesters
                                            </h4>
                                            <p className="text-gray-500">
                                                Tech University of Innovation - 2020-2022
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}

export default ProfilePage