<template>
    <el-dialog id="dialog" :visible.sync="loginDialog" :width="dialogWidth" :modal-append-to-body="false" :close-on-click-modal="false" :before-close="handleClose">
      <el-form :model="form" ref="form" :rules="formRules" class="form">
        <el-form-item>
          <h2 class="header-tip">查询消费养老金</h2>
        </el-form-item>
        <el-form-item prop="mobile">
          <el-autocomplete
            style="width: 100%;"
            @keyup.native.enter="getCode('form')"
            class="inline-input"
            v-model="form.mobile"
            :fetch-suggestions="querySearch"
            placeholder="请输入手机号"
          ></el-autocomplete>
        </el-form-item>
        <el-form-item prop="code">
          <el-col :xs="12" :span="18">
            <el-input @keyup.native.enter="login('form')" placeholder="请输入验证码" size="large" v-model="form.code" auto-complete="off"></el-input>
          </el-col>
          <el-col :xs="12" :span="6">
            <span class="code-btn" v-show="show" @click="getCode('form')">获取验证码</span>
            <span class="code-btn" v-show="!show" style="background-color: rgb(221, 221, 221)">{{count}}秒重新发送</span>
          </el-col>
        </el-form-item>
        <el-checkbox style="margin-bottom: 20px" v-model="checked">记住手机号</el-checkbox>
        <el-form-item>
          <el-button class="btn-submit" @click="login('form')">查询</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
</template>
<script>
import {mapGetters} from 'vuex'
import {code} from './../api/user'
export default {
  name: 'Header',
  data () {
    return {
      show: true,
      navToggle: false,
      count: '',
      timer: null,
      dialogWidth: '50%',
      loginDialog: false,
      activeIndex: '',
      checked:false,
      phones:[],
      form: {
        mobile: '',
        code: ''
      },
      formRules: {
        mobile: [
          { required: true, message: '手机号不能为空', trigger: 'blur' },
          { pattern: /^1[0-9]{10}$/, message: '请输入正确的手机号', trigger: ['change', 'blur'] }
        ],
        code: [
          { required: true, message: '验证码不能为空', trigger: ['change', 'blur'] },
          { max: 6, message: '验证码不能超过6个字符', trigger: ['change', 'blur'] }
        ]
      }
    }
  },
  computed: {
    ...mapGetters({
      token: 'token'
    })
  },
  watch: {
    $route (to, from) {
      this.activeIndex = this.$route.path
    }
  },
  created () {
    let w = document.documentElement.clientWidth
    if (w <= 576) {
      this.dialogWidth = '90%'
    }
    this.phones = JSON.parse(localStorage.getItem('phones')) || [];
  },
  mounted () {
    let that = this;
    that.activeIndex = that.$route.path;
    that.$root.bus.$on('toUser',function () {
      that.toRouter('/user');
    })
  },
  methods: {
    getCode (formName) {
      let self = this
      self.$refs[formName].validateField('mobile', (errorMessage) => {
        if (!errorMessage) {
          code({mobile: self.form.mobile}).then(res => {
            if (res.code === 1) {
              this.$message.info('发送成功')
            } else if (res.msg === '错误的手机号') {
              this.$message.error('请输入正确的手机号')
            } else {
              if (res.msg === '短信验证码发送次数过多') {
                this.$message.error('一个号码一天只能发送5条短信验证码,请明天重试!')
              }else{
                this.$message.error('发送失败')
              }
            }
          })
          const TIME_COUNT = 60
          if (!self.timer) {
            self.count = TIME_COUNT
            self.show = false
            self.timer = setInterval(() => {
              if (self.count > 0 && self.count <= TIME_COUNT) {
                self.count--
              } else {
                self.show = true
                clearInterval(self.timer)
                self.timer = null
              }
            }, 1000)
          }
        } else {
          return false
        }
      })
    },
    toRouter (router) {
      let self = this;
      if (router === '/user') {
        if (this.token === '') {
          this.loginDialog = true;
          // ios11 光标错位bug
            //   var h=window.pageYOffset;
            //   document.querySelector("#dialog").style.position = "absolute";
            //   document.querySelector("#dialog").style.top = h + 'px';
            //   document.querySelector("#dialog").style.overflow = 'visible';
            //   document.querySelector("html,body").style.overflow = 'hidden';
          this.$nextTick(function () {
            this.$refs['form'].resetFields();
            // 清计时器
            self.show = true;
            clearInterval(self.timer)
            self.timer = null;
          })
        } else {
          this.$router.push(router)
        }
      } else {
        this.$router.push(router)
      }
      this.navToggle = false
    },
    login (formName) {
      let self = this;
      self.$refs[formName].validate((valid) => {
        if (valid) {
          this.$store.dispatch('Login', self.form).then(res => {
            if (res) {
              if(self.checked){
                self.phones.push({value:self.form.mobile});
                localStorage.setItem('phones',JSON.stringify(self.phones))
              }
              document.querySelector("html,body").style.overflow = 'auto';
              self.loginDialog = false;
              self.$router.push('/user')
            }
          }).catch(err => {
            // promise reject
            self.$message.closeAll();
            self.$message.error(err)
          })
        } else {
          return false
        }
      })
    },
    logOut () {
      this.$store.commit('SET_TOKEN', '');
      this.$router.replace('/index')
    },
    toggle () {
      this.navToggle = !this.navToggle
    },
    querySearch(queryString, cb) {
      var phones = this.phones;
      var results = queryString ? phones.filter(this.createFilter(queryString)) : phones;
      cb(results);
    },
    createFilter(queryString) {
      return (phone) => {
        return (phone.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
      };
    },
    handleClose(done){
      document.querySelector("html,body").style.overflow = 'auto';
      done();
    }
  }
}
</script>
<style scoped lang="scss">
  .tool-bar-index{
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
  }
  .tool-bar {
    .show-xs-only{
      .mobile-wrap{
        display: block !important;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.5);
        position: fixed;
        top: 0;
      }
      .mobile-nav{
        .mobile-nav-header{
          position: fixed;
          height: 55px;
          line-height: 55px;
          width: 100%;
          left: 0;
          top: 0;
          background: #fff;
          border-bottom: 1px solid #CACACA;
          box-sizing: border-box;
          .navigation{
            position: absolute;
            left: 14px;
            top: 24px;
            width: 17px;
          }
          .logo{
            display: inline-block;
            position: absolute;
            left: 45%;
            top: 10px;
            margin: 11px 0 0 -25px;
            width: 50px;
            height: 18px;
          }
          .user{
            font-size: 14px;
            width: 8.6rem;
            height: 1.5rem;
            line-height: 1.5rem;
            background: rgba(245,194,66,1);
            border-radius: 1.29rem;
            margin: 11px 30px 0 0;
            position: absolute;
            right: -17px;
            top: 5px;
            text-align: center;
            color: #ffffff;
          }
          .user-info {
            background-image: url('./../assets/images/namelogo.jpg');
            background-position: center center;
            background-repeat: no-repeat;
            background-size: cover;
            display: inline-block;
            width: 40px;
            height: 40px;
            border-radius: 100%;
            overflow: hidden;
            cursor: pointer;
            margin: 8px 30px 0 0;
            position: absolute;
            right: -17px;
            top: 0;
          }
          .logout-btn{
            font-size: 14px;
            width: 6.14rem;
            height: 1.3rem;
            line-height: 1.3rem;
            background: rgba(245,194,66,1);
            border-radius: 1.29rem;
            margin: 17px 30px 0 0;
            position: absolute;
            right: -17px;
            top: 1px;
            text-align: center;
            color: #ffffff;
          }
        }
        .mobile-nav-body{
          display: block !important;
          position: fixed;
          left: 0;
          top: 55px;
          width: 100%;
          padding: 0 15px;
          background: #ffffff;
          a{
            display: block;
            color: #333333;
            border-bottom: 1px solid #DEDEDE;
            height: 55px;
            line-height: 55px;
            font-size: 15px;
            text-decoration: none;
          }
        }
      }
    }
    div {
      z-index: 3;
      .img {
        cursor: pointer;
        margin: 50px 0 0 80px;
        width: 280px;
      }
      .el-menu-demo {
        display: flex;
        justify-content: space-around;
        width: 70%;
        margin-top: 45px;
        .is-active::after {
          content: " ";
          width: 35px;
          background: #ffbf00;
          height: 3px;
          left: 50%;
          margin-left: -15px;
          display: inline-block;
          position: absolute;
          top: 58px;
        }
        li {
          text-align: center;
          flex: auto;
          &:hover::after {
            content: " ";
            width: 35px;
            background: #ffbf00;
            height: 3px;
            left: 50%;
            margin-left: -15px;
            display: inline-block;
            position: absolute;
            top: 58px;
          }

        }
        .single-item {
          .search-btn {
            font-size: 14px;
            padding: 3px 16px;
            background-color: #ffbf00;
            color: #fff;
            border-radius: 17px;
            text-align: center;
            cursor: pointer;
          }
          .user-info {
            background-image: url('./../assets/images/namelogo.jpg');
            background-position: center center;
            background-repeat: no-repeat;
            background-size: cover;
            display: inline-block;
            width: 40px;
            height: 40px;
            margin-right: 20px;
            border-radius: 100%;
            overflow: hidden;
          }
          .logout-btn {
            color: #ffbf00;
          }
          &:after {
            background: transparent !important;
          }
          &:hover {
            font-weight: unset;
          }
        }
      }
      .font-white {
        color: #fff !important;
      }
    }
    .line{
      height: 0;
      margin-top: 2px;
      margin-bottom: 20px;
      border-top: 1px solid #EDEDED
    }
    .form {
      width: 80%;
      margin: 10px auto 60px;
      .header-tip{
        text-align: center;
      }
      .code-btn {
        display: block;
        height: 40px;
        margin-left: 20px;
        line-height: 40px;
        text-align: center;
        background-color: #ffbf00;
        color: #fff;
        font-size: 14px;
        cursor: pointer;
      }
      .btn-submit{
        width: 100%;
        text-align: center;
        background-color: #ffbf00;
        border: 0;
        border-radius: 0;
        color: #fff;
        font-size: 14px;
      }
    }
  }
  /* iPad(768) 包含 */
  @media only screen and (max-width: 768px){
    .tool-bar{
      div{
        .img {
          margin: 50px 0 0 40px !important;
        }
        .el-menu-demo {
          width: 100% !important;
        }
      }
    }
  }
  @media only screen and (min-width: 992px) and (max-width: 1024px){
    .tool-bar{
      div{
        .img {
          margin: 50px 0 0 20px !important;
        }
        .el-menu-demo{
          width: 100% !important;
          justify-content: space-between;
        }
      }
    }
  }
</style>
