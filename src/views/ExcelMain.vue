<template>
  <div class="container">
    <div class="tools">
      <div class="tools__content">
        背景色:
        <n-color-picker
          :disabled="!currentCell.id"
          v-model:value="currentStyle.background"
          :show-alpha="false"
        />
        文本色:
        <n-color-picker
          :disabled="!currentCell.id"
          v-model:value="currentStyle.color"
          :show-alpha="false"
        />
        <!-- 字体： -->
        <n-select
          :disabled="!currentCell.id"
          v-model:value="currentStyle['font-family']"
          placeholder="请选择字体"
          size="tiny"
          :options="fontFamilyOpt"
        >
        </n-select>
        <!-- 字号： -->
        <n-select
          :disabled="!currentCell.id"
          v-model:value="currentStyle['font-size']"
          placeholder="请选择字号"
          size="tiny"
          :options="fontSizeOpt"
        >
        </n-select>
        <!-- 加粗: -->
        <n-switch
          v-model:value="currentStyle['font-weight']"
          :disabled="!currentCell.id"
        >
          <template #checked> 加粗 </template>
          <template #unchecked> 正常 </template>
        </n-switch>
        <!-- 水平对齐: -->
        <!-- <el-select
            size="mini"
            v-model="currentStyle['text-align']"
            placeholder="请选择水平对齐方式"
          >
            <el-option
              v-for="item in textAlignOpt"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select> -->
        <!-- <el-radio-group
          :disabled="!currentCell.id"
          v-model="currentStyle['text-align']"
        >
          <el-radio
            :label="item.label"
            v-for="item in textAlignOpt"
            :key="item.value"
            >{{ item.value }}</el-radio
          >
        </el-radio-group> -->
        <n-radio-group
          v-model:value="currentStyle['text-align']"
          :disabled="!currentCell.id"
        >
          <n-space>
            <n-radio
            style="width:100px"
              :value="item.label"
              v-for="item in textAlignOpt"
              :key="item.value"
            >
              {{ item.label }}
            </n-radio>
          </n-space>
        </n-radio-group>
        <n-button size="small" type="primary" plain @click="dataBack">
          回显
        </n-button>
        <n-button size="small" type="primary" @click="save">保存</n-button>
      </div>
    </div>
    <div class="excel" @click="clickContainer">
      <table cellspacing="0">
        <thead>
          <tr>
            <th
              @contextmenu.stop.prevent="rightClickTh(th)"
              :style="
                currentCell.td === th.index
                  ? 'background:#eaebec;border-bottom:1px solid black;'
                  : ''
              "
              v-for="(th, _thi) in thList"
              :key="_thi"
            >
              {{
                _thi === 0 && currentCell.id
                  ? "L" + currentCell.tr + ",C" + currentCell.td
                  : _thi === 0
                  ? ""
                  : convertNumber2ColTitle(_thi)
              }}
            </th>
            <n-button
              style="position: fixed; right: 0"
              @click="addCol"
              size="small"
            >
              添加列
            </n-button>
          </tr>
        </thead>
        <tbody class="tBody">
          <tr
            :style="`height:${tr.height}px`"
            v-for="(tr, _tri) in trList"
            :key="_tri"
          >
            <td
              :style="
                _tdi === 0 && currentCell.tr === td.tr
                  ? 'background:#eaebec;border-right:1px solid black;'
                  : _tdi === 0
                  ? ''
                  : convertStyle(td.style)
              "
              v-for="(td, _tdi) in tr.tdList"
              :key="_tdi"
              :class="`
                  ${currentCell.id === td.id ? 'active' : ''}
                `"
              @click.stop="_tdi === 0 ? selectRow(tr) : clickCell(td)"
              @dblclick="editCell(td)"
            >
              <n-input
                v-if="isEditing && editItem.id === td.id"
                v-model:value="td.value"
                @blur="handleIptBlur"
                size="tiny"
                :id="`${td.id}editCellIpt`"
              ></n-input>
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
          <n-button class="add-row-btn" @click="addRow" size="small">
            添加行
          </n-button>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script lang="ts" setup>
// 模拟数据
import trs from "@/data/trList";
import ths from "@/data/thList";
import {
  NSelect,
  NSwitch,
  NRadioGroup,
  NRadio,
  NSpace,
  NButton,
  NInput,
  NColorPicker,
} from "naive-ui";
import { nextTick, onMounted, ref } from "vue";
const thList = ref<any>([]);
const trList = ref<any>([]);
const currentCell = ref<any>({});
const currentStyle = ref<any>({});
const editItem = ref<any>({});
const isEditing = ref(false);
const cellStyle = ref({
  background: "#FFFFFF",
  color: "#000000",
  "text-align": "center",
  "font-weight": "normal",
  "font-family": "auto",
  "font-size": "intinal",
});
const textAlignOpt = [
  {
    value: "居左",
    label: "left",
  },
  {
    value: "居中",
    label: "center",
  },
  {
    value: "居右",
    label: "right",
  },
];
const fontFamilyOpt = [
  {
    value: "auto",
    label: "自动",
  },
  {
    value: "Arial",
    label: "Arial",
  },
  {
    value: "Verdana",
    label: "Verdana",
  },
  {
    value: "Georgia",
    label: "Georgia",
  },
  {
    value: "Times New Roman",
    label: "Times New Roman",
  },
  {
    value: "Trebuchet MS",
    label: "Trebuchet MS",
  },
  {
    value: "Courier New",
    label: "Courier New",
  },
  {
    value: "Impact",
    label: "Impact",
  },
  {
    value: "Comic Sans MS",
    label: "Comic Sans MS",
  },
  {
    value: "Consolas",
    label: "Consolas",
  },
  {
    value: "Lucida Console",
    label: "Lucida Console",
  },
  {
    value: "monospace",
    label: "monospace",
  },
];
const fontSizeOpt = [
  {
    value: "intinal",
    label: "默认",
  },
  {
    value: "14px",
    label: "14px",
  },
  {
    value: "15px",
    label: "15px",
  },
  {
    value: "16px",
    label: "16px",
  },
  {
    value: "17px",
    label: "17px",
  },
  {
    value: "18px",
    label: "18px",
  },
  {
    value: "19px",
    label: "19px",
  },
  {
    value: "20px",
    label: "20px",
  },
  {
    value: "21px",
    label: "21px",
  },
  {
    value: "22px",
    label: "22px",
  },
  {
    value: "23px",
    label: "23px",
  },
  {
    value: "24px",
    label: "24px",
  },
  {
    value: "55px",
    label: "55px",
  },
];
onMounted(() => {
  init();
});
const convertNumber2ColTitle = (columnNumber: number) => {
  if (columnNumber <= 0) return "";
  let res = [];
  while (columnNumber) {
    // 通过让 columnNumber - 1，使得余数 remain 减少 1
    columnNumber--;
    let remain = columnNumber % 26;
    res.unshift(String.fromCharCode(remain + 65));
    columnNumber = Math.floor(columnNumber / 26);
  }
  return res.join("");
};
const rightClickTh = (th: any) => {
  // this.$contextmenu({
  //   items: [
  //     {
  //       label: "删除所在列",
  //       icon: "el-icon-delete",
  //       onClick: () => this.deleteCol(th),
  //     },
  //     // {
  //     //   label: "设置列宽",
  //     //   onClick: () => {
  //     //     this.$message.info("设置列宽");
  //     //     console.log("设置列宽");
  //     //   },
  //     // },
  //     // { label: "前进(F)", disabled: true },
  //     // { label: "重新加载(R)", divided: true, icon: "el-icon-refresh" },
  //     // { label: "另存为(A)..." },
  //     // { label: "打印(P)...", icon: "el-icon-printer" },
  //     // { label: "投射(C)...", divided: true },
  //     // {
  //     //   label: "使用网页翻译(T)",
  //     //   divided: true,
  //     //   minWidth: 0,
  //     //   children: [
  //     //     { label: "翻译成简体中文" },
  //     //     { label: "翻译成繁体中文" },
  //     //   ],
  //     // },
  //     // {
  //     //   label: "截取网页(R)",
  //     //   minWidth: 0,
  //     //   children: [
  //     //     {
  //     //       label: "截取可视化区域",
  //     //       onClick: () => {
  //     //         this.message = "截取可视化区域";
  //     //         console.log("截取可视化区域");
  //     //       },
  //     //     },
  //     //     { label: "截取全屏" },
  //     //   ],
  //     // },
  //     // { label: "查看网页源代码(V)", icon: "el-icon-view" },
  //     // { label: "检查(N)" },
  //   ],
  //   event, // 鼠标事件信息
  //   customClass: "rightMenu", // 自定义菜单 class
  //   zIndex: 3, // 菜单样式 z-index
  //   minWidth: "100%", // 主菜单最小宽度
  // });
  // return false;
}
const selectRow = (tr) => {
  console.log(tr, "selected row");
};
const convertStyle = (styleObj) => {
  ["font-size", "line-height"];
  let str = "";
  for (const key of Object.keys(styleObj)) {
    str += `${key}:${styleObj[key] === "" ? `''` : styleObj[key]};`;
  }
  return str;
};
const init = () => {
  for (let index = 0; index < 20; index++) {
    thList.value.push({
      title: index,
      index: index,
    });
  }
  for (let index = 0; index < 30; index++) {
    let tdList = [];
    for (let i = 0; i < 20; i++) {
      tdList.push({
        value: i === 0 ? index + 1 : "",
        // 几行几列
        id: i === 0 ? "" : `${index + 1}${i}`,
        tr: index + 1,
        td: i === 0 ? "" : i,
        style: Object.assign({}, cellStyle.value),
      });
    }
    trList.value.push({
      tr: index + 1,
      height: 20,
      tdList,
    });
  }
};
// 模拟数据回显
const dataBack = () => {
  thList.value = ths;
  trList.value = trs;
};

// 点击单元格
const clickCell = (td) => {
  currentCell.value = td;
  currentStyle.value = td.style;
};

// 双击编辑单元格
const editCell = (td) => {
  isEditing.value = true;
  editItem.value = td;
  nextTick(() => {
    let ipt = document.getElementById(td.id + "editCellIpt");
    (ipt as any).focus();
  });
};

// 增加行
const addRow = () => {
  let tdList = [];
  for (let i = 0; i < thList.value.length; i++) {
    tdList.push({
      value: i === 0 ? trList.value.length + 1 : "",
      id: `${trList.value.length + 1}${i + 1}`,
      tr: trList.value.length + 1,
      td: i === 0 ? "" : i,
      style: Object.assign({}, cellStyle.value),
    });
  }
  trList.value.push({
    height: 20,
    tdList,
  });
};

// 增加列
const addCol = () => {
  trList.value.forEach((tr, i) => {
    tr.tdList.push({
      value: "89",
      id: `${i + 1}${thList.value.length + 1}`,
      tr: i + 1,
      td: thList.value.length + 1,
      style: Object.assign({}, cellStyle.value),
    });
  });
  thList.value.push({
    title: thList.value.length,
    index: thList.value.length,
  });
};

// const deleteCol = (thObj) => {
//   if (currentCell.value.td === thObj.index) {
//     currentCell.value = {};
//   }
//   trList.value.forEach((tr, i) => {
//     tr.tdList.forEach((td, _tdi) => {
//       if (td.td === thObj.index) {
//         tr.tdList.splice(_tdi, 1);
//       }
//     });
//   });
//   thList.value.forEach((th, _thi) => {
//     if (th.index === thObj.index) {
//       thList.value.splice(_thi, 1);
//     }
//   });
// };
const save = () => {
  console.log({
    tableData: {
      thList: thList.value,
      trList: trList.value,
    },
  });
};

const handleIptBlur = () => {
  isEditing.value = false;
};

const clickContainer = () => {
  currentCell.value = {};
};
</script>
<style lang="less" scoped>
.container {
  .tools {
    height: 50px;
    display: flex;
    align-items: center;
    justify-content: center;
    &__content {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
  }
  .excel {
    width: calc(100vw - 100px);
    overflow: auto;
    height: calc(100vh - 100px);
    border: 1px solid #e2e4e8;
  }
  td,
  th {
    border-right: 1px solid #e2e4e8;
    border-bottom: 1px solid #e2e4e8;
    width: 100px;
    height: 20px;
    text-align: center;
    cursor: pointer;
    &:hover {
      background: rgba(143, 170, 228, 0.5);
    }
  }
  td {
    :deep(.n-input) {
      .n-input__inner {
        text-align: center;
      }
    }
    .cell {
      display: inline-block;
      height: 20px;
      line-height: 20px;
      word-break: keep-all;
      border-color: #fff;
    }
  }
  th {
    background-color: #f9fafb;
  }
  .active {
    .cell {
      display: block;
      border: 2px solid rgb(94, 41, 192);
      // height: 38px;
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
    background-color: #f9fafb;
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
<style lang="less">
.rightMenu {
  border: 1px solid rgb(0, 0, 0);
  padding: 0 !important;
  border-radius: 0 !important;
  .menu_item__available {
    &:hover {
      background: #5693d9 !important;
      color: #ffffff !important;
    }
  }
  .menu_item_expand {
    background: #5693d9 !important;
    color: #ffffff !important;
  }
}
</style>
