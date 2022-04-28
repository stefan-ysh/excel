<template>
  <div class="container">
    <div
      class="tools"
      style="display: flex; align-items: center; justify-content: center"
    >
      <div v-if="currentCell.id" style="display: flex; align-items: center">
        {{ currentCell.tr }}行{{ currentCell.td }}列 
        填充色:
        <el-color-picker
          v-model="currentCell.style.background"
          @active-change="changeBgColor"
        ></el-color-picker>
        文本颜色:
        <el-color-picker
          v-model="currentCell.style['color']"
          @active-change="changeColor"
        ></el-color-picker>
        加粗:
        <el-switch
          :active-value="900"
          :inactive-value="0"
          v-model="currentCell.style['font-weight']"
          active-color="#13ce66"
          inactive-color="#ff4949"
        >
        </el-switch>
        <span @click="save">保存</span>
      </div>
    </div>
    <div class="excel" @click="calcelEdit">
      <table cellspacing="0">
        <thead>
          <tr>
            <th
              :style="currentCell.td === th.index ? 'background:grey' : ''"
              v-for="(th, _thi) in thList"
              :key="_thi"
            >
              {{ _thi === 0 ? "" : letterList[_thi - 1] }}
            </th>
            <el-button
              style="position: fixed; right: 0"
              @click="addCol"
              size="small"
            >
              添加列
            </el-button>
          </tr>
        </thead>
        <tbody class="tBody">
          <tr v-for="(tr, _tri) in trList" :key="_tri">
            <td
              :style="
                _tdi === 0 && currentCell.tr === td.tr
                  ? 'background:grey'
                  : _tdi === 0
                  ? ''
                  : convertStyle(td.style)
              "
              v-for="(td, _tdi) in tr.tdList"
              :key="_tdi"
              :class="
                `
                ${currentCell.id === td.id ? 'active' : ''}
              `
              "
              @click.stop="_tdi === 0 ? null : clickCell(td)"
              @dblclick="editCell(td)"
            >
              <el-input
                v-if="isEditing && editItem.id === td.id"
                v-model="td.value"
                @blur="cancelEdit"
                :id="`${td.id}editCellIpt`"
              ></el-input>
              <template v-else>
                <span class="cell">
                  {{ td.value }}
                </span>
              </template>
              <!-- 调节行高的 bar -->
              <div
                v-if="_tdi === 0"
                style="
                  cursor: ns-resize;
                  width: 100px;
                  height: 5px;
                  position: absolute;
                  bottom: -2px;
                "
              ></div>
            </td>
          </tr>
          <el-button class="add-row-btn" @click="addRow" size="small">
            添加行
          </el-button>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
/*eslint-disable */
export default {
  name: "Excel",
  data() {
    return {
      // letterList: ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z']
      letterList: [
        "A",
        "B",
        "C",
        "D",
        "E",
        "F",
        "G",
        "H",
        "I",
        "J",
        "K",
        "L",
        "M",
        "N",
        "O",
        "P",
        "Q",
        "R",
        "S",
        "T",
        "U",
        "V",
        "W",
        "X",
        "Y",
        "Z"
      ],
      thList: [],
      trList: [],
      currentCell: {},
      editItem: {},
      isEditing: false,
      cellStyle: {
        background: "",
        color: "",
        "text-align": "",
        "font-weight": 0
      }
    };
  },
  created() {
    this.init();
  },
  methods: {
    fontBold() {
      if (this.currentCell.style["font-weight"]) {
        this.$set(this.currentCell.style, "font-weight", 0);
      } else {
        this.$set(this.currentCell.style, "font-weight", 900);
      }
    },
    changeBgColor(bgColor) {
      //   let _this = this;
      //   this.trList.forEach((tr, i) => {
      //     if (i === _this.currentCell.tr - 1) {
      //       console.log(9);
      //       tr.tdList.forEach((td) => {
      //         if (td.id === _this.currentCell.id) {
      //           console.log(10);
      //           td.style.background = color;
      //         }
      //       });
      //     }
      //   });
      //   console.log(this.currentCell.style.background);
      this.currentCell.style.background = bgColor;
      console.log(this.currentCell.style.background);
      //   //   console.log(color);
      //   // console.log(this.trList);
    },
    changeColor(color) {
      this.currentCell.style.color = color;
    },
    convertStyle(styleObj) {
      let str = "";
      for (const key of Object.keys(styleObj)) {
        str += `${key}:${styleObj[key] === "" ? `''` : styleObj[key]};`;
      }
      return str;
    },
    init() {
      for (let index = 0; index < 20; index++) {
        this.thList.push({
          title: index,
          index: index
        });
      }
      for (let index = 0; index < 15; index++) {
        let tdList = [];
        for (let i = 0; i < 20; i++) {
          tdList.push({
            value: i === 0 ? index + 1 : "测试文字",
            id: `${index + 1}${i + 1}`,
            tr: index + 1,
            td: i + 1,
            style: Object.assign({}, this.cellStyle)
          });
        }
        this.trList.push({
          tdList
        });
      }
    },
    clickCell(td) {
      this.currentCell = Object.assign({}, td);
    },
    editCell(td) {
      this.isEditing = true;
      this.editItem = td;
      this.$nextTick(() => {
        let ipt = document.getElementById(td.id + "editCellIpt");
        ipt.focus();
      });
    },
    addRow() {
      let tdList = [];
      for (let i = 0; i < this.thList.length; i++) {
        tdList.push({
          value: i === 0 ? this.trList.length + 1 : "",
          id: `${this.trList.length + 1}${i + 1}`,
          tr: this.trList.length + 1,
          td: i + 1,
          style: Object.assign({}, this.cellStyle)
        });
      }
      this.trList.push({ tdList });
    },
    addCol() {
      this.trList.forEach((tr, i) => {
        tr.tdList.push({
          value: "89",
          id: `${i + 1}${this.thList.length + 1}`,
          tr: i + 1,
          td: this.thList.length + 1,
          style: Object.assign({}, this.cellStyle)
        });
      });
      this.thList.push({
        title: this.thList.length,
        index: this.thList.length
      });
    },
    save() {
      this.currentCell.style.background = "";
      console.log({
        tableData: {
          thList: this.thList,
          trList: this.trList
        }
      });
    },
    cancelEdit() {
      this.isEditing = false;
    },
    calcelEdit() {
      this.currentCell = {};
    }
  },
  computed: {}
};
</script>
<style lang="less" scoped>
.container {
  .tools {
    height: 50px;
  }
  .excel {
    width: calc(100vw - 100px);
    overflow: auto;
    height: calc(100vh - 100px);
  }
  td,
  th {
    border-right: 1px solid gray;
    border-bottom: 1px solid gray;
    width: 100px;
    height: 30px;
    text-align: center;
    cursor: pointer;
    &:hover {
      background: rgba(143, 170, 228, 0.5);
    }
  }
  td {
    /deep/ .el-input {
      .el-input__inner {
        text-align: center;
      }
    }
    .cell {
      display: inline-block;
      height: 40px;
      line-height: 40px;
      word-break: keep-all;
    }
  }
  th {
    background-color: lightblue;
  }
  .active {
    span {
      display: block;
      border: 2px solid rgb(94, 41, 192);
      border-radius: 2px;
      margin: -2px;
    }
  }
  table {
    table-layout: fixed;
    width: 100%;
  }
  td:first-child,
  th:first-child {
    position: sticky;
    left: 0;
    z-index: 1;
    background-color: #dcdcdc;
  }
  .add-row-btn {
    position: fixed;
    left: 0;
    bottom: 0;
  }
  thead tr th {
    position: sticky;
    top: 0;
  }
  th:first-child {
    z-index: 2;
    background-color: lightblue;
  }
}
</style>
