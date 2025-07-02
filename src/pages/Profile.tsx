import React from 'react'
import { motion } from 'framer-motion'
import { useProfileStore } from '../store/profileStore'
import { 
  User, 
  Briefcase, 
  GraduationCap, 
  Award, 
  MapPin,
  Calendar,
  ExternalLink
} from 'lucide-react'

const Profile = () => {
  const { profileData } = useProfileStore()

  if (!profileData) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="loading-spinner"></div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        className="text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-4xl font-bold gradient-text mb-4">
          Your LinkedIn Profile
        </h1>
        <p className="text-xl text-gray-600">
          Review and analyze your current profile information
        </p>
      </motion.div>

      {/* Profile Overview */}
      <motion.div
        className="card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <div className="flex items-start space-x-6">
          <div className="w-24 h-24 bg-gradient-to-br from-linkedin-500 to-purple-600 rounded-full flex items-center justify-center">
            <User className="w-12 h-12 text-white" />
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {profileData.headline}
            </h2>
            <div className="flex items-center space-x-4 text-gray-600 mb-4">
              <div className="flex items-center space-x-1">
                <MapPin className="w-4 h-4" />
                <span>Location</span>
              </div>
              <div className="flex items-center space-x-1">
                <Calendar className="w-4 h-4" />
                <span>Last updated: {new Date(profileData.lastUpdated).toLocaleDateString()}</span>
              </div>
            </div>
            <div className="flex space-x-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-linkedin-500">
                  {profileData.connections}
                </div>
                <div className="text-sm text-gray-600">Connections</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-linkedin-500">
                  {profileData.profileViews}
                </div>
                <div className="text-sm text-gray-600">Profile Views</div>
              </div>
            </div>
          </div>
          <button className="btn-secondary">
            <ExternalLink className="w-4 h-4 mr-2" />
            View on LinkedIn
          </button>
        </div>
      </motion.div>

      {/* Summary */}
      <motion.div
        className="card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <h3 className="text-xl font-semibold mb-4 flex items-center">
          <User className="w-5 h-5 mr-2 text-linkedin-500" />
          About
        </h3>
        <p className="text-gray-700 leading-relaxed">
          {profileData.summary}
        </p>
      </motion.div>

      {/* Experience */}
      <motion.div
        className="card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <h3 className="text-xl font-semibold mb-6 flex items-center">
          <Briefcase className="w-5 h-5 mr-2 text-linkedin-500" />
          Experience
        </h3>
        <div className="space-y-6">
          {profileData.experience.map((exp, index) => (
            <div key={index} className="border-l-2 border-linkedin-200 pl-6 relative">
              <div className="absolute w-3 h-3 bg-linkedin-500 rounded-full -left-2 top-2"></div>
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-semibold text-lg text-gray-900">{exp.title}</h4>
                <p className="text-linkedin-600 font-medium">{exp.company}</p>
                <p className="text-sm text-gray-500 mb-3">{exp.duration}</p>
                <p className="text-gray-700">{exp.description}</p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Education */}
      <motion.div
        className="card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <h3 className="text-xl font-semibold mb-6 flex items-center">
          <GraduationCap className="w-5 h-5 mr-2 text-linkedin-500" />
          Education
        </h3>
        <div className="space-y-4">
          {profileData.education.map((edu, index) => (
            <div key={index} className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-semibold text-lg text-gray-900">{edu.school}</h4>
              <p className="text-linkedin-600">{edu.degree} in {edu.field}</p>
              <p className="text-sm text-gray-500">{edu.year}</p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Skills */}
      <motion.div
        className="card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        <h3 className="text-xl font-semibold mb-6 flex items-center">
          <Award className="w-5 h-5 mr-2 text-linkedin-500" />
          Skills & Expertise
        </h3>
        <div className="flex flex-wrap gap-3">
          {profileData.skills.map((skill, index) => (
            <span
              key={index}
              className="px-4 py-2 bg-linkedin-100 text-linkedin-700 rounded-full text-sm font-medium hover:bg-linkedin-200 transition-colors cursor-pointer"
            >
              {skill}
            </span>
          ))}
        </div>
      </motion.div>
    </div>
  )
}

export default Profile