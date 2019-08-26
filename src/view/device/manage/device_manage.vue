<style lang="less">
// @import '../../../../styles/common.less';
// @import '../../../tables/components/table.less';
.text-align-right {
  text-align: right;
}
#opt button{
  margin-right: 5px;
}
// .ivu-table td.expandcolumn{
// 	border-left: none;
//     background-color: #2db7f5;
//     color: #fff;
// }
</style>

<template>
  <div>
    <Row :gutter="10">
      <Col span="24">
        <Card>
          <p slot="title">
            <Icon type></Icon>设备管理
          </p>
          <Row>
            <i-col span="12" id="opt">
              <Button type="info" icon="plus-round" @click="handleEdit('add')">新增</Button>
              <Button type="success" icon="hammer" @click="handleEdit('edit')">修改</Button>
              <Button type="error" icon="close" @click="handleDelete()">删除</Button>
              <Button type="primary" icon="ios-arrow-down" @click="handleExpexcel()">导出到Excel</Button>
            </i-col>
            <i-col span="12" class="text-align-right">
              <Input v-model="table.keywords" placeholder="请输入搜索内容..." style="width: 200px" />
              <span @click="handleSearch(1)" style="margin: 0 10px;">
                <Button type="primary" icon="search">搜索</Button>
              </span>
              <Button @click="handleCancel" icon="ios-shuffle-strong" type="primary">清除</Button>
            </i-col>
          </Row>
          <Row class="margin-top-10">
            <Table
              stripe
              ref="selection"
              :columns="columns"
              :data="data"
              :loading="table.loading"
              @on-selection-change="saveSelection"
              @on-sort-change="changeSort"
            ></Table>
          </Row>
          <Row class="margin-top-10">
            <Page
              @on-change="changePage"
              @on-page-size-change="changePageSize"
              :current="page.current"
              :total="page.total"
              :page-size="page.pagesize"
              :page-size-opts="page.pagesizeopts"
              show-total
              show-elevator
              show-sizer
            ></Page>
          </Row>
        </Card>
      </Col>
    </Row>
    <!-- <Modal v-model="pwdupdate" title="修改密码" @on-ok="updatepwd('pwdupdate')">
			<div>
				<Form ref="pwdform" :model="pwdform" :rules="ruleCustom" :label-width="80">
					<FormItem label="输入密码" prop="passwd">
						<Input type="password" v-model="pwdform.passwd"></Input>
					</FormItem>
					<FormItem label="确认密码" prop="passwdCheck">
						<Input type="password" v-model="pwdform.passwdCheck"></Input>
					</FormItem>
					 <FormItem>
						<Button type="primary" @click="handleSubmit('formCustom')">Submit</Button>
						<Button @click="handleReset('formCustom')" style="margin-left: 8px">Reset</Button>
    </FormItem>-->
    <!-- 	</Form>
			</div>
    </Modal>-->
  </div>
</template>

<script>
import Cookies from "js-cookie";
import expandRow from "./expandRow.vue";
export default {
  name: "device-manage",
  components: { expandRow },
  data() {
    return {
      // pwdupdate:false,//密码弹窗
      delete_comfirm_loading: false,
      impexcel_loading: false,
      table: {
        loading: true,
        selection: [],
        keywords: ""
      },
      page: {
        total: 100,
        current: 1,
        pagesize: 10,
        pagesizeopts: [10, 25, 50, 100],
        // 原代码为  key: 'username', 但不符合通用规则,修改成id为key,如有需要可以改正
        key: "id",
        order: "desc"
      },

      columns: [
        {
          key: "id",
          width: 60,
          type: "selection",
          align: "center"
        },

        {
          key: "sn",
          title: "设备号",
          sortable: "custom"
        },

        {
          key: "name",
          title: "设备名称",
          sortable: "custom"
        },

        {
          key: "sensorstr",
          title: "传感器",
          // type: 'expand',
          ellipsis: true,
          // tooltip : true, 2.0 不支持
          sortable: "custom"
        },
        {
          type: "expand",
          ellipsis: true,
          width: 30,
          // tooltip : true, 2.0 不支持
          sortable: "custom",
          className: "expandcolumn",
          render: (h, params) => {
            console.log("-------------");
            console.log(params.row.id);
            return h(expandRow, {
              props: {
                row: params.row.id
              }
            });
          }
        },
        {
          key: "describes",
          title: "设备描述",
          sortable: "custom"
        },
        {
          key: "treaty",
          title: "设备协议",
          sortable: "custom"
        },

        {
          key: "location",
          title: "设备位置",
          sortable: "custom"
        },

        {
          key: "createtime",
          title: "创建时间",
          sortable: "custom"
        },

        {
          title: "操作",
          key: "action",
          align: "center",
          render: (h, params) => {
            return h("div", [
              h(
                "Button",
                {
                  props: {
                    type: "primary",
                    size: "small"
                  },
                  style: {
                    marginRight: "5px"
                  },
                  on: {
                    click: () => {
                      let self = this;
                      this.$Modal.confirm({
                        // loading:true,
                        title: "重置密码确认",
                        content:
                          "<p>你要重置的用户为" +
                          params.row.username +
                          "，要继续重置操作吗？</p>",
                        onOk: function() {
                          // this.currentid = params.row.id;
                          console.log(self);
                          self.resetpwd(params.row.id);
                        }
                      });
                    }
                  }
                },
                "重置密码"
              )
            ]);
          }
        }
      ],
      data: []
    };
  },
  methods: {
    saveSelection(selection) {
      this.table.selection = selection;
    },
    handleSearch(topage) {
      let self = this;
      let pagesize = this.page.pagesize;
      if (topage) this.page.current = topage;
      let current = this.page.current - 1;
      let key = this.page.key;
      let order = this.page.order;
      let sort = key + "," + order; // 排序
      if (order == "normal") {
        key = "";
        order = "";
        sort = "";
      }
      let keywords = this.table.keywords;
      this.table.loading = true; // loading效果
      this.$axios
        .get(
          "/iotplant/device/mngpagedata?page=" +
            current +
            "&size=" +
            pagesize +
            "&sort=" +
            sort +
            "&keywords=" +
            keywords,
          {},
          {
            headers: {
              "Content-Type": "application/json;charset=utf-8"
            }
          }
        )
        .then(function(response) {
          console.log(response);
          self.table.loading = false; // 取消loading效果
          if (response.data.totalElements > 0) {
            self.page.total = response.data.totalElements;
            self.data = response.data.content;
          } else {
            self.page.total = 0;
            self.data = [];
          }
          self.table.selection = [];
        })
        .catch(function(response) {
          self.$util.logout(self, response);
        });
    },
    handleCancel() {
      this.table.keywords = "";
      this.handleSearch();
    },
    handleEdit(type) {
      if (type == "add") {
        let query = { id: "", refresh: true };
        console.log(this.$router)
        this.$router.push({
          name: "device_edit",
          query: query
        });
      } else if (type == "edit") {
        let roleid = Cookies.get("roleid");
        let selection = this.table.selection;
        if (selection.length == 0) this.$Message.warning("您尚未选择一行数据!");
        if (selection.length > 1)
          this.$Message.warning(
            "您选择了" +
              selection.length +
              "行数据，请取消选择其中的" +
              (selection.length - 1) +
              "行!"
          );
        if (selection[0].role < roleid) {
          this.$Message.warning("您没有权限修改此用户!");
          return;
        }
        if (selection.length == 1) {
          let query = { id: selection[0].id, refresh: true };
          this.$router.push({
            name: "device_edit",
            query: query
          });
        }
      }
    },
    handleSelectAll(status) {
      this.$refs.selection.selectAll(status);
    },
    changePage(current) {
      // if(!current) current=1;
      this.page.current = current;
      this.handleSearch();
    },
    changePageSize(pagesize) {
      this.page.pagesize = pagesize;
      this.handleSearch();
    },
    changeSort(column) {
      this.page.key = column.key;
      this.page.order = column.order;
      this.handleSearch();
    },
    handleExpexcel() {
      let key = this.page.key;
      let order = this.page.order;
      let sort = key + "," + order; // 排序
      if (order == "normal") {
        key = "";
        order = "";
      }
      let keywords = this.table.keywords;
      window.location.href =
        "/netgate-server/user/expexcel?sort=" +
        sort +
        "&size=1000&keywords=" +
        keywords;
    },
    handleImpexcelSuccess(response, file) {
      this.impexcel_loading = false;
      if (response.ok) {
        this.$Message.success("数据导入成功!");
        this.handleSearch();
      } else {
        this.$Modal.error({ title: "导入失败", content: response.msg });
      }
    },
    handleImpexcelFormatError(file) {
      this.$Notice.warning({
        title: "文件类型有误",
        desc:
          "文件： " +
          file.name +
          " 格式有误, 请选择‘xls’，‘xlsx’或‘csv’格式的文件."
      });
    },
    handleImpexcelMaxSize(file) {
      this.$Notice.warning({
        title: "文件过大",
        desc: "文件： " + file.name + " 过大, 上传文件最大不能超过 4M."
      });
    },
    handleImpexcelBeforeUpload() {
      this.impexcel_loading = true;
    },
    handleDelete() {
      let self = this;
      let selection = this.table.selection;
      if (selection.length == 0) this.$Message.warning("您尚未选择一行数据!");
      if (selection.length > 0) {
        this.$Modal.confirm({
          loading: true,
          title: "删除操作确认",
          content: "<p>数据删除后不可恢复，要继续删除操作吗？</p>",
          onOk: function() {
            let modal = this;
            let selection = self.table.selection;
            let usersids = "",
              flag = "";
            for (let i = 0; i < selection.length; i++) {
              usersids += flag + selection[i].id;
              flag = ",";
            }
            this.$axios
              .delete(
                "/netgate-server/user/delete?usersids=" + usersids,
                {},
                {
                  headers: {
                    "Content-Type": "application/json;charset=utf-8"
                  }
                }
              )
              .then(function(response) {
                modal.remove();
                self.$Message.warning("删除成功!");
                self.table.selection = [];
                self.handleSearch();
              })
              .catch(function(response) {
                console.log(response);
              });
          }
        });
      }
    }
  },
  mounted() {
    // 分页会自动触发changePageSize方法 注释下面代码以防止重复刷新
    this.handleSearch();
  },
  watch: {
    $route(to) {
      // 监听强制刷新列表指令，表单保存后跳转到列表TAB页，列表自动刷新
      console.log(22);
      console.log(to);
      if (to.name == "device-manage" && to.query && to.query.refresh) {
        delete to.query.refresh;
        this.handleSearch();
      }
    }
  }
};
</script>
