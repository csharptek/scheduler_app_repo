const API_BASE_URL = "https://localhost:7027/";

const projectApiList = {
  validatePasswords: `${API_BASE_URL}api/validate-passwords`,
  DeleteCandidate: (id) =>
    `${API_BASE_URL}schedulerAPI/schedule_interview/delete/${id}`,

  scheduleInterviewToken: ` ${API_BASE_URL}api/schedule_interview/interviews/token`,
  getEnabledInterviewers: `${API_BASE_URL}api/interviewer/getInterviewerList`,
  updateEnabledInterviewers: (interviewerId) =>
    `${API_BASE_URL}api/createusers/users/${interviewerId}/`,
  updateInterviewerStatus: (interviewerId) =>
    `${API_BASE_URL}api/createusers/users/${interviewerId}/`,
  getUsers: `${API_BASE_URL}api/createusers/users`,
  createUser: `${API_BASE_URL}api/InternalUser/create`,

  updateUser: (userId) => `${API_BASE_URL}api/InternalUser/edit/${userId}/`,

  deleteUser: (userId) => `${API_BASE_URL}api/createusers/delete/${userId}/`,
  createInterview: ` ${API_BASE_URL}api/schedule_interview/Add`,

  ScheduleInterviewList: `${API_BASE_URL}api/schedule_interview/list`,
  ExternalInterviewList: `${API_BASE_URL}api/ExternalCandidate/get-external-candidate`,
  InterviewSchedule: `${API_BASE_URL}api/Feedback/save-interview-details`,
  ExternalCandidateList:(eId)=> `${API_BASE_URL}api/ScheduledInterview/ExternalRecCandidateList/${eId}`,

  RegisterExternalUser:`${API_BASE_URL}api/ExternalRecruiters/Register`,
  toggleUserStatus:`${API_BASE_URL}api/ExternalRecruiters/ToggleUserStatus`,
  provisionExternalRecruiter:`${API_BASE_URL}api/ExternalRecruiters/ProvisionExternalRecruiter`,
  SendMailApi:`${API_BASE_URL}api/MailController/send_mail`,
};
export { API_BASE_URL, projectApiList };
