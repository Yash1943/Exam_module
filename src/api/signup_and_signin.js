import {makeApiCall,handleApiError} from './makeapicall'

export const save_signup_data = async (full_name, collage_name, branch, addhar_card_no, applied_position_preference, prn_no, phone_no, email_id, semester, password) => {
  return makeApiCall("samcore.samcore_api.save_signup_data", {
    full_name, collage_name, branch, addhar_card_no, applied_position_preference, prn_no, phone_no, email_id, semester, password
  });
};
export const check_signin_apptitude_exam = async (addhar_no,password) => {
  return makeApiCall("samcore.samcore_api.check_signin_apptitude_exam", {
    addhar_no,password
  });
};
export const get_position_preffrence = async () => {
  return makeApiCall("samcore.samcore_api.get_apptitude_active_postion", {
   
  });
};