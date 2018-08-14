<template>
  <el-dialog id="dialog" :visible.sync="loginDialog" :width="dialogWidth" :modal-append-to-body="false" :close-on-click-modal="false" :before-close="handleClose">
    <el-form :model="form" ref="form" :rules="formRules" class="form">
      <el-form-item>
        <h3 class="header-tip">大可爱的近期计划</h3>
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
  import {code} from './../apis'
  export default {
    name: 'Header',
    data () {
      return {
        show: true,
        count: '',
        timer: null,
        dialogWidth: '50%',
        loginDialog: false,
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

    created () {
      let w = document.documentElement.clientWidth
      if (w <= 576) {
        this.dialogWidth = '95%'
      }
      let arr = JSON.parse(localStorage.getItem('phones')) || [];
      for (let i = 0; i < arr.length - 1; i++) {
        for (let j = 1; j < arr.length; j++) {
          if (i != j) {
            if (arr[i].x == arr[j].x && arr[i].y == arr[j].y) {
              arr.splice(j, 1)
            }
          }
        }
      }
      this.phones = arr;
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
      login (formName) {
        let self = this;
        self.$refs[formName].validate((valid) => {
          if (valid) {
            this.$store.dispatch('Login', self.form).then(res => {
              if (res) {
                if(self.checked){
                  if(self.findIndexByValue(self.phones,self.form.mobile) < 0){
                    self.phones.push({value:self.form.mobile});
                  }
                  localStorage.setItem('phones',JSON.stringify(self.phones))
                }
                document.querySelector("html,body").style.overflow = 'auto';
                self.loginDialog = false;
                self.$router.push('/user')
              } else {
                // 未注册
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
      },
      findIndexByValue(arr,value){ //级联改变时获得选中值index
        for(let [index,obj] of arr.entries()){
          if(value === obj.value){
            return index;
          }
        }
        return -1;
      },
    }
  }
</script>
<style scoped lang="scss">
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
</style>
