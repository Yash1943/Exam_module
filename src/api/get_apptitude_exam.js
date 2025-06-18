import { makeApiCall, makePostApiCall, handleApiError } from "./makeapicall";

export const get_apptitude_exams = async (username) => {
  return makeApiCall("samcore.samcore_api.get_apptitude_exams", {
    username
  });
};