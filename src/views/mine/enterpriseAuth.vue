<template>
  <div class="enterpriseAuth">
    <div class="page-header">
      <el-breadcrumb class="breadcrumb" :separator-icon="ArrowRight">
        <el-breadcrumb-item>
          <router-link to="/mine/accountSecurity">
            <span class="cf6 f14">账户安全</span>
          </router-link>
        </el-breadcrumb-item>
        <el-breadcrumb-item>
          <router-link to="/mine/accountSecurity/realNameAuth">
            <span class="cf6 f14">实名认证</span>
          </router-link>
        </el-breadcrumb-item>
        <el-breadcrumb-item>
          <span class="fw700 f14 cf85">企业认证</span>
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="page-content">
      <div class="content-card">
        <div class="header">
          <div class="header-left">
            <span>企业认证</span>
            <el-popover popper-class="notice_pop" placement="right" :offset="10" trigger="hover" width="auto"
              popper-style="padding: 5px 8px;">
              <template #reference>
                <i class="spacehpc_iconfont hpc_basic_icon_info_circle cf6"
                  style="margin-left: 10px; font-size: 19px; margin-top: 4px"></i>
              </template>
              <div class="notice_card">
                <div class="notice_content" style="color: rgba(255, 255, 255, 0.85)">
                  您的认证信息将会加密保存，不会泄露给第三方。
                </div>
              </div>
            </el-popover>
          </div>
          <div class="flex header-center" v-if="true">
            <div class="flex">
              <div class="underReview f14 fw500">1</div>
              <span class="cf65 f14" style="line-height: 24px">填写信息</span>
            </div>
            <div class="line"></div>
            <div class="flex">
              <div class="finish f14 fw500">2</div>
              <span class="cf85 f14" style="line-height: 24px">后台审核</span>
            </div>
            <div class="line"></div>
            <div class="flex">
              <div class="finish f14 fw500">3</div>
              <span class="cf45 f14" style="line-height: 24px">认证完成</span>
            </div>
          </div>
        </div>

        <el-form :model="form" :rules="rules" ref="formRef" label-width="140px" class="form">
          <el-form-item label="企业证件类型" prop="licenseType">
            <el-select v-model="form.licenseType" placeholder="请选择企业证件类型">
              <el-option label="营业执照" value="0"></el-option>
              <!-- <el-option label="组织机构代码证" value="1"></el-option> -->
            </el-select>
          </el-form-item>

          <el-form-item label="上传营业执照附件" prop="businessLicense">
            <template v-if="fileList">
              <el-upload class="upload-demo" action="" :limit="1" :before-upload="beforeUpload"
                :file-list="fileList.businessLicense" :on-preview="handlePictureCardPreview" :on-progress="onProgress"
                :class="{ disabled: uploadDisabled }" :on-change="handleChange0" :http-request="handleUpload"
                :on-remove="handleRemove0" accept=".jpg,.png" list-type="picture-card">
                <el-icon class="avatar-uploader-icon">
                  <Plus />
                </el-icon>
                <div>企业营业执照</div>
                <template #tip>
                  <div class="el-upload__tip">
                    支持：jpg、png格式图片，大小不超过5M
                  </div>
                </template>
              </el-upload>
            </template>
          </el-form-item>

          <el-form-item label="企业名称" prop="companyName">
            <el-input v-model="form.companyName" placeholder="请输入企业名称"></el-input>
          </el-form-item>

          <el-form-item label="企业证件号码" prop="licenseNumber">
            <el-input v-model="form.licenseNumber" placeholder="请输入企业证件号码"></el-input>
          </el-form-item>

          <div class="header">
            <div class="header-left">
              <span>法人/被授权人信息</span>
            </div>
          </div>

          <el-form-item label="被授权人身份" prop="authorizedIdentity">
            <el-radio-group v-model="form.authorizedIdentity">
              <el-radio value="0">法定代表人</el-radio>
              <el-radio value="1">被授权人</el-radio>
            </el-radio-group>
          </el-form-item>

          <el-form-item label="上传身份证附件" prop="idCardFront">
            <el-upload class="upload-demo" style="flex-flow: column" action=""
              :before-upload="(file) => beforeUpload(file, formField)" :class="{ disabled: uploadDisabled1 }"
              :on-preview="handlePictureCardPreview" :on-remove="handleRemove1" :on-error="handleUploadError"
              :on-progress="onProgress" :file-list="fileList.idCardFront" :on-change="handleChange1"
              :http-request="handleUpload" list-type="picture-card" accept=".jpg,.png">
              <el-icon class="avatar-uploader-icon">
                <Plus />
              </el-icon>
              <div>身份证正面</div>
              <template #tip>
                <div class="el-upload__tip">
                  支持：jpg、png格式图片，大小不超过5M
                </div>
              </template>
            </el-upload>

            <el-upload class="upload-demo" style="flex-flow: column" action=""
              :before-upload="(file) => beforeUpload(file, formField)" :class="{ disabled: uploadDisabled2 }"
              :on-preview="handlePictureCardPreview" :on-remove="handleRemove2" :on-progress="onProgress"
              :on-error="handleUploadError" :file-list="fileList.idCardFront" :on-change="handleChange2"
              :http-request="handleUpload" list-type="picture-card" accept=".jpg,.png">
              <el-icon class="avatar-uploader-icon">
                <Plus />
              </el-icon>
              <div>身份证反面</div>
              <template #tip>
                <div class="el-upload__tip">
                  支持：jpg、png格式图片，大小不超过5M
                </div>
              </template>
            </el-upload>
            <el-upload class="upload-demo" style="flex-flow: column" action=""
              :before-upload="(file) => beforeUpload(file, formField)" v-if="form.authorizedIdentity == 1"
              :class="{ disabled: uploadDisabled3 }" :on-preview="handlePictureCardPreview" :on-remove="handleRemove3"
              :on-progress="onProgress" :on-error="handleUploadError" :file-list="fileList.idCardFront"
              :on-change="handleChange3" :http-request="handleUpload" list-type="picture-card" accept=".jpg,.png">
              <el-icon class="avatar-uploader-icon">
                <Plus />
              </el-icon>
              <div>授权委托书</div>
              <template #tip>
                <div class="el-upload__tip">
                  <span>支持：jpg、png格式图片，大小不超过5M </span>
                  <span style="margin-left: 32px" class="linkbtn" @click="download()">下载授权委托书</span>
                </div>
              </template>
            </el-upload>
          </el-form-item>

          <el-form-item label="姓名" prop="authorizedName">
            <el-input v-model="form.authorizedName" placeholder="请输入姓名"></el-input>
          </el-form-item>

          <el-form-item label="证件号码" prop="authorizedIdCard">
            <el-input v-model="form.authorizedIdCard" placeholder="请输入身份证号"></el-input>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <div class="page-bottom flex justity-between">
      <div class="right">
        <div class="right-top flex f14" style="line-height: 22px">
          <el-checkbox v-model="Agree" label="" :indeterminate="false" @change=""></el-checkbox><span>同意</span>
          <span class="linkbtn" @click="permission('permission')">《龙游星海实名认证许可协议》</span><span>及</span><span
            class="linkbtn" @click="permission('privacy')">《隐私协议》</span>
        </div>
        <div class="right-top flex f14" style="line-height: 22px">
          <el-checkbox v-model="Agree1" label="" :indeterminate="false"
            @change=""></el-checkbox><span>本人确认提供信息真实有效，龙游星海有权自行或委托第三方，审查您提供的信息是否真实/有效，若提供虚假信息，由此带来的后果由您承担。</span>
        </div>
      </div>

      <div class="left flex">
        <el-button class="primarybtn mr20 hw120" type="primary" size="default" :loading="loading"
          @click="submitForm">确认提交</el-button>
        <el-button class="bgBtn hw120" text size="default"
          @click="router.push('/mine/accountSecurity/realNameAuth')">取消</el-button>
      </div>
    </div>
  </div>
  <el-dialog v-model="dialogVisible">
    <img :src="dialogImageUrl" alt="Preview Image" style="width: 100%" />
  </el-dialog>
</template>

<script setup>
import { ArrowRight, Loading } from "@element-plus/icons-vue";
import { ref, onMounted } from "vue";
import { ElMessage } from "element-plus";
import { enterprise, enterpriseReVerify, getAuthLetterPath } from "@/api/login";
import router from "@/routers/routes";
const uploadDisabled = ref(false);
const uploadDisabled1 = ref(false);
const uploadDisabled2 = ref(false);
const uploadDisabled3 = ref(false);
const formRef = ref(null);
const dialogVisible = ref(false);
const form = ref({
  licenseType: "0",
  businessLicense: "",
  companyName: "",
  licenseNumber: "",
  authorizedIdentity: "",
  idCardFront: "",
  idCardBack: "",
  authorizationLetter: "",
  authorizedName: "",
  authorizedIdCard: "",
});

const rules = {
  licenseType: [
    { required: true, message: "请选择企业证件类型", trigger: "change" },
  ],
  businessLicense: [
    { required: true, message: "请上传营业执照附件", trigger: "change" },
  ],
  companyName: [
    { required: true, message: "请输入企业名称", trigger: "blur" },
    {
      pattern: /^.{5,30}$/,
      message: "请输入正确的企业名称",
      trigger: "blur",
    },
  ],
  licenseNumber: [
    { required: true, message: "请输入企业证件号码", trigger: "blur" },
    {
      pattern: /^[a-zA-Z0-9]{8,20}$/,
      message: "统一社会信用代码不正确",
      trigger: "blur",
    },
  ],
  authorizedIdentity: [
    { required: true, message: "请选择被授权人身份", trigger: "change" },
  ],
  idCardFront: [
    { required: true, message: "请上传身份证正面", trigger: "change" },
  ],
  idCardBack: [
    { required: true, message: "请上传身份证反面", trigger: "change" },
  ],
  authorizationLetter: [
    { required: true, message: "请上传授权委托书", trigger: "change" },
  ],
  authorizedName: [
    { required: true, message: "请输入姓名", trigger: "blur" },
    {
      pattern: /^.{0,20}$/,
      message: "请输入正确的姓名",
      trigger: "blur",
    },
  ],
  authorizedIdCard: [
    { required: true, message: "请输入身份证号", trigger: "blur" },
    {
      pattern:
        /^[1-9]\d{5}(18|19|20)\d{2}(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])\d{3}[0-9Xx]$/,
      message: "身份证号格式不正确",
      trigger: "blur",
    },
  ],
};
const downloadLink = ref("");
getAuthLetterPath().then((res) => {
  downloadLink.value = res.data;
});

const Agree = ref(false);
const Agree1 = ref(false);
const dialogImageUrl = ref("");
const loading = ref(false);
const fileList = ref({
  businessLicense: [],
  idCardFront: [],
  idCardBack: [],
  authorizationLetter: [],
});
console.log(fileList.value.businessLicense); // Add this line to check the value

const beforeUpload = (file, formField) => {
  const isJPG = file.type === "image/jpeg";
  const isPNG = file.type === "image/png";
  const isLt5M = file.size / 1024 / 1024 < 5;

  if (!isJPG && !isPNG) {
    return false
  }
  if (!isLt5M) {
    return false
  }

  // 如果通过所有检查，更新表单字段
  getBase64(file).then(base64 => {
    form.value[formField] = base64;
  });

  return isJPG || isPNG;
};
// const beforeUpload = (file, formField) => {
//   getBase64(file).then(base64 => {
//     form.value[formField] = base64;
//   });

//   return isJPG || isPNG;
// };
const route = useRoute();
onMounted(() => {
  // 打印
  // console.log("route:", route.query.action);
});

const handleSuccess1 = (field) => (response, file, fileList) => {
  // console.log(uploadDisabled1, "uploadDisabled1");
  uploadDisabled1.value = true;
  const reader = new FileReader();
  reader.readAsDataURL(file.raw);
  reader.onload = () => {
    form.value[field] = reader.result;
  };
};

const submitForm = () => {
  formRef.value.validate((valid) => {
    if (valid) {
      if (!Agree.value || !Agree1.value) {
        ElMessage.error("请勾选协议!");
        return false;
      }
      // console.log(form.value, "form.value");
      if (!form.value.idCardBack) {
        ElMessage.error("请上传身份证反面!");
        return;
      }
      // console.log(form.value.authorizationLetter, form.value.authorizedIdentity);
      if (!form.value.authorizationLetter && form.value.authorizedIdentity == 1) {
        ElMessage.error("请上传授权委托书!");
        return;
      }
      if (route.query.action === "reVerify") {
        loading.value = true;
        enterpriseReVerify(form.value).then((res) => {
          if (res.code === 200) {
            loading.value = false;
            ElMessage.success("提交成功!");
            router.push("/mine/accountSecurity");
          } else {
            ElMessage.error(res.message);
          }
        });
      } else {
        loading.value = true;
        enterprise(form.value).then((res) => {
          if (res.code === 200) {
            loading.value = false;
            ElMessage.success("提交成功!");
            router.push("/mine/accountSecurity");
          } else {
            ElMessage.error(res.message);
          }
        });
      }
    } else {
      ElMessage.error("请填写完整信息!");
      return false;
    }
  });
};

const handleUpload = (file) => {

};
const handleUploadError = (err, file, fileList) => {
  console.error("Upload error:", err);
  ElMessage.error("上传失败，请重试");
};

const resetForm = () => {
  formRef.value.resetFields();
  fileList.value = {
    businessLicense: [],
    idCardFront: [],
    idCardBack: [],
    authorizationLetter: [],
  };
};
function onProgress(event, file, fileList) {
  uploadDisabled.value = false;
}

// 图片上传失败
function imgError(err, file, fileList) {
  uploadDisabled.value = true;
}
// 预览图片
function handlePictureCardPreview(file) {
  dialogImageUrl.value = URL.createObjectURL(file.raw);
  dialogVisible.value = true;
  uploadDisabled.value = true;
}

// 删除图片
function handleRemove(file, fileList, uploadDisabledVar, formField) {
  uploadDisabledVar.value = false;
  form.value[formField] = ""; // 清空对应的表单字段
  dialogImageUrl.value = "";
}
function handleRemoveFactory(uploadDisabledVar, formField) {
  return function (file, fileList) {
    handleRemove(file, fileList, uploadDisabledVar, formField);
  };
}
const handleRemove0 = handleRemoveFactory(uploadDisabled, "businessLicense");
const handleRemove1 = handleRemoveFactory(uploadDisabled1, "idCardFront");
const handleRemove2 = handleRemoveFactory(uploadDisabled2, "idCardBack");
const handleRemove3 = handleRemoveFactory(uploadDisabled3, "authorizationLetter");


// function handleChange(file, fileList, formField, uploadDisabledVar) {
//   dialogImageUrl.value = file.url;
//   getBase64(file.raw).then((base64) => {
//     form.value[formField] = base64;
//     if (fileList.length) {
//       uploadDisabledVar.value = true;
//     } else {
//       uploadDisabledVar.value = false;
//     }
//   });

//   // Ensure fileList is an array
//   console.log(fileList, "fileListfileList");
//   if (Array.isArray(fileList)) {
//     fileList = fileList;
//   } else {
//     fileList = [];
//   }
// }
function handleChange(file, fileList, formField, uploadDisabledVar) {
  const isJPG = file.raw.type === "image/jpeg";
  const isPNG = file.raw.type === "image/png";
  const isLt5M = file.size / 1024 / 1024 < 5;

  if (!isJPG && !isPNG) {
    ElMessage.error("上传图片只能是 JPG 或 PNG 格式!");
    return false;
  }
  if (!isLt5M) {
    ElMessage.error("上传图片大小不能超过 5MB!");
    return false;
  }
  // 文件大小检查已经在 beforeUpload 中完成，这里不需要重复
  dialogImageUrl.value = URL.createObjectURL(file.raw);
  getBase64(file.raw).then((base64) => {
    form.value[formField] = base64;
    if (fileList.length) {
      uploadDisabledVar.value = true;
    } else {
      uploadDisabledVar.value = false;
    }
  });
}


onUnmounted(() => {
  if (dialogImageUrl.value.startsWith('blob:')) {
    URL.revokeObjectURL(dialogImageUrl.value);
  }
});

function handleChangeFactory(formField, uploadDisabledVar) {
  return function (file, fileList) {
    handleChange(file, fileList, formField, uploadDisabledVar);
  };
}
const handleChange0 = handleChangeFactory("businessLicense", uploadDisabled);
const handleChange1 = handleChangeFactory("idCardFront", uploadDisabled1);
const handleChange2 = handleChangeFactory("idCardBack", uploadDisabled2);
const handleChange3 = handleChangeFactory(
  "authorizationLetter",
  uploadDisabled3
);
// 调试 fileList
console.log(fileList.value.businessLicense);

//图片更改

// 获取图片转base64
function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
}
function permission(type) {
  if (type == "permission") {
    window.open(
      "https://ovie6zh9otu.feishu.cn/wiki/DeYjwqpo5iNDMCkffDEcSQBSnUg?from=from_copylink"
    );
  } else {
    window.open(
      "https://ovie6zh9otu.feishu.cn/wiki/SY7ewi7LZi8WJ5keHkNcgERNnZk?from=from_copylink"
    );
  }
}
// 下载授权委托书
function download() {
  window.open(downloadLink.value);
}
</script>

<style lang="less" scoped>
.enterpriseAuth {
  overflow: auto;
  height: 100%;

  .page-header {
    .breadcrumb {
      width: 100%;
    }
  }

  .page-content {
    overflow: auto;
    box-shadow: 0px 1px 2px -1px rgba(0, 0, 0, 0.64),
      0px 3px 6px 0px rgba(0, 0, 0, 0.48), 0px 5px 12px 1px rgba(0, 0, 0, 0.36);

    padding: 20px;

    .content-card {
      padding: 20px 30px;
      display: flex;
      flex-flow: column;
      margin-top: 15px;
      border-radius: 10px;
      box-shadow: 0px 1px 2px -1px rgba(0, 0, 0, 0.64),
        0px 3px 6px 0px rgba(0, 0, 0, 0.48),
        0px 5px 12px 1px rgba(0, 0, 0, 0.36);
      box-sizing: border-box;
      position: relative;
      z-index: 1;

      .header {
        display: flex;
        margin-bottom: 20px;

        .header-left {
          display: flex;
          font-size: 18px;
          line-height: 26px;
        }

        .header-center {
          margin-left: 370px;

          .flex {
            .underReview {
              width: 24px;
              border-radius: 50%;
              background-color: #177ddc;
              height: 24px;

              display: flex;
              font-weight: 500;
              place-content: center;
              place-items: center;
              margin-right: 8px;
            }

            .finish {
              width: 24px;
              display: flex;

              border-radius: 50%;
              background: rgba(0, 0, 0, 0.15);
              border: 1px solid rgba(255, 255, 255, 0.3);
              height: 24px;
              font-weight: 500;
              place-content: center;
              place-items: center;
              margin-right: 8px;
            }
          }
        }

        .line {
          width: 160px;
          height: 1px;
          background: rgba(255, 255, 255, 0.15);
          margin: 0px 8px;
        }

        font-weight: 700;
      }

      :deep(.form) {
        .el-form-item {
          margin-bottom: 15px;

          .el-select {
            width: 340px;
          }

          .el-select__wrapper {
            box-shadow: none;
            width: 340px;
            --el-fill-color-blank: #0b1320;
          }

          .el-input {
            width: 340px;
          }

          .el-input__wrapper {
            box-shadow: none;
            width: 340px;
            --el-input-bg-color: #0b1320;
            --el-fill-color-blank: #0b1320;
          }

          .disabled .el-upload.el-upload--picture-card {
            display: none !important;
          }

          .disabled .el-upload--picture-card {
            display: none;
          }

          .el-upload--picture-card {
            --el-border-color-darker: rgba(255, 255, 255, 0.2);
          }

          .disabled .el-button--success.is-plain {
            display: none !important;
          }

          .upload-demo {
            margin-right: 20px;

            .el-upload-list__item {
              width: 340px;
              --el-upload-list-picture-card-size: 160px;
              margin: 0px;
            }

            .el-upload {
              width: 340px;
              flex-flow: column;
              background-color: #0b1320;
            }

            .el-upload:hover {
              color: rgba(255, 255, 255, 0.85);
            }
          }
        }
      }
    }
  }

  .page-bottom {
    height: 80px;
    padding: 0px 60px;
    margin-top: 15px;
    box-sizing: border-box;
    background-color: #1d222a;
    box-shadow: 0px -4px 8px 0px rgba(0, 0, 0, 0.32);
  }
}
</style>
