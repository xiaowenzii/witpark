import * as echarts from '../../component/ec-canvas/echarts'
import * as util from "../../../utils/util"; 

Page({
  data: {
    condtionDialogHeight: 0,
    deviceTypeId:'',
    airDeviceInfo: {}, //空调数据
    buildingList: {},  //建筑列表
    buildingSelectedItem: '',
    floorList: '', //楼层列表
    floorSelectedItem: '',
    selectFloorDialog: false
  },
  selectBuilding(e){ //选择楼
    let item = e.currentTarget.dataset.item;
    this.setData({buildingSelectedItem: item});
    if(item.id=='1'){
      this.getKtDashboard(item.id, '', '');
    }else{
      this.getKtDashboard('', item.id, '');
    }
  },
  selectFloorDialog(){ //弹出选择楼层下拉框
    this.setData({
      selectFloorDialog: !this.data.selectFloorDialog,
    });
  },
  selectFloor: function(e) { //选择楼层
    let item = e.detail.data;
    this.setData({
      floorSelectedItem: item,
      selectFloorDialog: false
    })
    if(item.id=='30' || item.id=='20' || item.id=='40'){
      this.getKtDashboard('', item.id, '');
    }else{
      this.getKtDashboard('', '', item.id);
    }
  },
  getBuildingFloor(){ //查询楼宇列表
    let that = this;
    let params = { id: '', name: '', code: '', type: '', parentId: '' }
    util.wxRequestGet("/prod-api/business/buildingFloor/list", "加载中...", params, 'application/x-www-form-urlencoded', function(res) {
      if(res.code==200){
        if(res.data!=null){
          let list = [];
          let parkItem = {};
          let parkItemFloors = [];
          let newItem = {};
          let newItemFloors = [];
          let oldItem = {};
          let oldItemFloors = [];
          let foodItem = {};
          let foodItemFloors = [];
          for(let i=0; i<res.data.length; i++){
            if(res.data[i].code=='SN_PARK'){
              parkItem.id = res.data[i].id;
              parkItem.code = res.data[i].code;
              parkItem.name = '园区';
              parkItemFloors.push(res.data[i]);
            }else if(res.data[i].code=='SN_NEW_BUILD'||res.data[i].code.includes('SN_NEW_BUILD_')){
              if(res.data[i].code=='SN_NEW_BUILD'){
                newItem.id = res.data[i].id;
                newItem.code = res.data[i].code;
                newItem.name = res.data[i].name;
              }
              newItemFloors.push(res.data[i]);
            }else if(res.data[i].code=='SN_OLD_BUILD'||res.data[i].code.includes('SN_OLD_BUILD_')){
              if(res.data[i].code=='SN_OLD_BUILD'){
                oldItem.id = res.data[i].id;
                oldItem.code = res.data[i].code;
                oldItem.name = res.data[i].name;
              }
              oldItemFloors.push(res.data[i]);
            }else if(res.data[i].code=='SN_CANTEEN'){
              foodItem.id = res.data[i].id;
              foodItem.code = res.data[i].code;
              foodItem.name = res.data[i].name;
              foodItemFloors.push(res.data[i]);
            }
            if(i==res.data.length-1){
              parkItem.floors = parkItemFloors;
              newItem.floors = newItemFloors;
              oldItem.floors = oldItemFloors;
              foodItem.floors = foodItemFloors;
              list.push(parkItem);
              list.push(newItem);
              list.push(oldItem);
              list.push(foodItem);

              that.setData({
                buildingList: list,
                buildingSelectedItem: list[0],
                floorList: list[0].floors,
                floorSelectedItem: list[0].floors[0]
              })
              that.getKtDashboard(list[0].id, '', '');
            }
          }
        }
      }
    }, function(error) {})
  },
  getKtDashboard(areaId, buildingId, floorId){ //获取空调设备统计数据:园区ID, 楼ID, 楼层ID
    let that = this;
    let params = { areaId: areaId, buildingId: buildingId, floorId: floorId };
    util.wxRequestGet("/prod-api/business/kt/dashboard", "加载中...", params, 'application/x-www-form-urlencoded', function(res) {
      if(res.code==200){
        that.setData({
          airDeviceInfo: res.data
        })
      }
    }, function(error) {})
  },
  onLoad(options) {
    this.setData({
      deviceTypeId: options.deviceTypeId
    });
  },
  onReady() {
    // 初始化条件选择框高度
    let rpxHeight = util.getScreenHeightRpx()-90;
    this.setData({
      condtionDialogHeight: rpxHeight
    })
    this.getBuildingFloor(); //查询楼宇列表
  }
})