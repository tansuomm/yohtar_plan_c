<template>
  <div id="container" class="container">
    <draggable v-model="dataOne" :options="dragOptions" element="ul" class="block" :move="onMove">
      <transition-group name="transition" class="li-wrap">
        <li class="item" v-for="item in dataOne" :key="item.id">{{item.title}}</li>
      </transition-group>
    </draggable>
    <draggable v-model="dataTwo" :options="dragOptions" element="ul" class="block" :move="onMove">
      <transition-group name="transition" class="li-wrap">
        <li class="item" v-for="item in dataTwo" :key="item.id">{{item.title}}</li>
      </transition-group>
    </draggable>
    <draggable v-model="dataThree" :options="dragOptions" element="ul" class="block" :move="onMove">
      <transition-group name="transition" class="li-wrap">
        <li class="item" v-for="item in dataThree" :key="item.id">{{item.title}}</li>
      </transition-group>
    </draggable>
    <draggable v-model="dataFour" :options="dragOptions" element="ul" class="block" :move="onMove">
      <transition-group name="transition" class="li-wrap">
        <li class="item" v-for="item in dataFour" :key="item.id">{{item.title}}</li>
      </transition-group>
    </draggable>
  </div>
</template>

<script>
import draggable from 'vuedraggable'
import login from './../components/Login'
export default {
  name: 'HelloWorld',
  components:{
    draggable,
    login
  },
  data () {
    return {
      //近期计划事情 的记录  用户表和计划表(id,title,sort,createTime,type,uid)
      //未完成：add,modify,手动排序吗？记录位置，添加一件根据距今时间来排序，手动排序后更具sort排序
      //已完成：删除数据
      //  o hhah 2d3h1m
      //  o aaaa 3m2s
       // 距离创建时间提示 
      dataOne:[],
      dataTwo:[],
      dataThree:[],
      dataFour:[]
    }
  },
    created(){
      let result = [{
        id:'23242',
        title:'aa2',
        sort:'',
        createTime:'1144222222222',
        type:1
      },{
        id:'332',
        title:'aa3a',
        sort:'',
        createTime:'1144222222222',
        type:2
      },{
        id:'23242',
        title:'aa2',
        sort:'',
        createTime:'1144222222222',
        type:1
      },{
        id:'332',
        title:'aa3a',
        sort:'',
        createTime:'1144222222222',
        type:2
      },{
        id:'23242',
        title:'aa2',
        sort:'',
        createTime:'1144222222222',
        type:1
      },{
        id:'332',
        title:'aa3a',
        sort:'',
        createTime:'1144222222222',
        type:2
      },{
        id:'23242',
        title:'aa2',
        sort:'',
        createTime:'1144222222222',
        type:1
      },{
        id:'332',
        title:'aa3a',
        sort:'',
        createTime:'1144222222222',
        type:2
      },{
        id:'23242',
        title:'aa2',
        sort:'',
        createTime:'1144222222222',
        type:1
      },{
        id:'332',
        title:'aa3a',
        sort:'',
        createTime:'1144222222222',
        type:2
      },{
        id:'23242',
        title:'aa2',
        sort:'',
        createTime:'1144222222222',
        type:1
      },{
        id:'332',
        title:'aa3a',
        sort:'',
        createTime:'1144222222222',
        type:2
      },{
        id:'23242',
        title:'aa2',
        sort:'',
        createTime:'1144222222222',
        type:1
      },{
        id:'332',
        title:'aa3a',
        sort:'',
        createTime:'1144222222222',
        type:2
      },{
        id:'23242',
        title:'aa2',
        sort:'',
        createTime:'1144222222222',
        type:1
      },{
        id:'332',
        title:'aa3a',
        sort:'',
        createTime:'1144222222222',
        type:2
      },{
        id:'23242',
        title:'aa2',
        sort:'',
        createTime:'1144222222222',
        type:1
      },{
        id:'332',
        title:'aa3a',
        sort:'',
        createTime:'1144222222222',
        type:2
      },{
        id:'23242',
        title:'aa2',
        sort:'',
        createTime:'1144222222222',
        type:1
      },{
        id:'332',
        title:'aa3a',
        sort:'',
        createTime:'1144222222222',
        type:2
      },{
        id:'2',
        title:'aacc2',
        sort:'',
        createTime:'1144222222222',
        type:1
      },{
        id:'355',
        title:'aa3a',
        sort:'',
        createTime:'1144222222222',
        type:2
      },
      {
        id:'33333',
        title:'aa4a',
        sort:'',
        createTime:'1144222222222',
        type:3
      },{
        id:'222222',
        title:'a5aa',
        sort:'',
        createTime:'1144222222222',
        type:4
      }]

      for(let value of result){
        if(value.type ==1){
          this.dataOne.push(value);
        }else if(value.type ==2){
          this.dataTwo.push(value);
        }else if(value.type ==3){
          this.dataThree.push(value);
        }else{
          this.dataFour.push(value);
        }
      }
    },
    computed: {
      dragOptions () {
        return  {
          group: 'description',
          disabled: false,
        };
      },
    },
   methods:{
     onMove(){
      //保存
     }
   }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
  .container {
      width: 100%;
      height:100%;
      color: #ffffff;
      font-size: 18px;
      display: grid;
      grid-template-columns: repeat(auto-fit, 50%);
      grid-template-rows: repeat(4, 50%);
  }
  .block{
    padding: 5px;
    background: #2c3e50;
    margin: 10px;
    overflow: scroll;
    .li-wrap{
      display: inline-block;
      width: 100%;
      min-height: 40px;
      li{
        line-height: 40px;
        cursor: move;
      }
      .transition-move{
        transition: transform .5s;
      }
    }
    
  }
</style>
