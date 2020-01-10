import axios from 'axios'
import config from '@/../static/test1.json'

const apiObject=axios.create({
  baseURL:config.db_configuration.baseURL
});
const credential=localStorage.getItem('credential')
if(credential)
  apiObject.defaults.headers.common.Authorization=credential
export default apiObject;
