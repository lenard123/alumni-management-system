import moment from 'moment'
import { Http, Echo } from '@/js/utils'
import Cookie from 'js-cookie'
import _ from 'lodash'

//Export common functions to windows
window._ = _
window.moment = moment
window.Http = Http
window.Cookie = Cookie
window.Echo = Echo