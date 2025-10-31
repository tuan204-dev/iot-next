
import { FaFigma, FaGithub } from 'react-icons/fa'
import { HiOutlineDocumentText } from 'react-icons/hi'
import { MdApi } from 'react-icons/md'
import { SiPostman } from 'react-icons/si'

const ProfilePage = () => {
    return (
        <div className="flex flex-col flex-1 overflow-hidden">
            {/* Main content area */}
            <main className="flex-1 overflow-y-auto p-8 bg-gradient-to-br from-purple-50 to-pink-50">
                {/* Profile Header */}
                <div className="ant-card mb-8 bg-white/70 backdrop-blur-sm shadow-xl border border-purple-100 rounded-2xl">
                    <div className="p-8">
                        <div className="flex flex-col md:flex-row items-center">
                            <div className="mb-6 md:mb-0 md:mr-8">
                                <img
                                    src="https://avatar.iran.liara.run/public/35"
                                    alt="Profile"
                                    className="profile-photo w-40 h-40 rounded-full object-cover shadow-2xl ring-4 ring-purple-200"
                                />
                            </div>
                            <div className="text-center md:text-left">
                                <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-3">
                                    Thân Văn Tiệp
                                </h1>
                                <p className="text-xl text-purple-600 font-semibold mb-4">
                                    Information Technology Student
                                </p>
                                <div className="flex justify-center md:justify-start space-x-6">
                                    <a
                                        href="https://github.com/tuan204-dev"
                                        target="_blank"
                                        className="p-3 bg-gradient-to-br from-gray-700 to-gray-900 rounded-xl text-white hover:scale-110 transition-all duration-300 shadow-lg"
                                        title="GitHub"
                                    >
                                        <FaGithub className="text-2xl" />
                                    </a>
                                    <a
                                        href="https://www.figma.com/design/U4bpYGDz5aHOaRDDSj1dnj"
                                        target="_blank"
                                        className="p-3 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl text-white hover:scale-110 transition-all duration-300 shadow-lg"
                                        title="Figma Design"
                                    >
                                        <FaFigma className="text-2xl" />
                                    </a>
                                    <a
                                        href="https://drive.google.com/file/d/17Y9-nqtct2E7HgTExdf4-IBm-Smg1n61/view?usp=sharing"
                                        target="_blank"
                                        className="p-3 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl text-white hover:scale-110 transition-all duration-300 shadow-lg"
                                        title="Project Documentation"
                                    >
                                        <HiOutlineDocumentText className="text-2xl" />
                                    </a>
                                    <a
                                        href="http://localhost:8000/api"
                                        target="_blank"
                                        className="p-3 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl text-white hover:scale-110 transition-all duration-300 shadow-lg"
                                        title="API Documentation"
                                    >
                                        <MdApi className="text-2xl" />
                                    </a>
                                    <a
                                        href="https://web.postman.co/workspace/My-Workspace~2543eb00-7a4c-447e-87e3-2dd7bd2b3b46/collection/28667228-2fb0c021-9828-4ee4-8fab-c659a320650f?action=share&creator=28667228"
                                        target="_blank"
                                        className="p-3 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl text-white hover:scale-110 transition-all duration-300 shadow-lg"
                                        title="Postman Collection"
                                    >
                                        <SiPostman className="text-2xl" />
                                    </a>
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