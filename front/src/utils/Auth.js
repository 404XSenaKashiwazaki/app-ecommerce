import axios from "axios"

export const auth =  async () => {
  try {
    const { data } = await axios.get("http://localhost:8000/refresh-token",{ withCredentials: true })
    const user = jwtDecode(data.accessToken)
    dispatch({
      type: "LOGIN",
      payload: user
    })
  } catch (error) {
    console.log(error.response);
    if(error.response.status == 401){
      navigate("/login")
    }
  }
}