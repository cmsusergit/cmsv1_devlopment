import axios from 'axios'
import config from '@/../static/test1.json'

const apiObject=axios.create({
  baseURL:"http://100.100.102.177:4041/cmsempapi"
});
export default apiObject;
