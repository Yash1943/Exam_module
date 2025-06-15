import { makeApiCall, makePostApiCall, handleApiError } from "./makeapicall";

export const save_signup_data = async (
  full_name,
  collage_name,
  branch,
  addhar_card_no,
  applied_position_preference,
  prn_no,
  phone_no,
  email_id,
  semester,
  password
) => {
  return makeApiCall("samcore.samcore_api.save_signup_data", {
    full_name,
    collage_name,
    branch,
    addhar_card_no,
    applied_position_preference,
    prn_no,
    phone_no,
    email_id,
    semester,
    password,
  });
};
export const get_exam_apptitude_info = async (cetegory_type) => {
  return makeApiCall("samcore.samcore_api.get_exam_apptitude_info", {
    cetegory_type,
  });
};
export const get_exam_apptitude_questions = async (cetegory_type) => {
  return makeApiCall("samcore.samcore_api.get_exam_apptitude_questions", {
    cetegory_type,
  });
};
export const save_apptitude_evalution = async (
  username,
  exam_type,
  total_marks,
  participant_evaluation
) => {
  console.log(username, exam_type, total_marks, participant_evaluation);
  return makePostApiCall("samcore.samcore_api.save_apptitude_evalution", {
    username,
    exam_type,
    total_marks,
    participant_evaluation,
  });
};
