<template>
  <div class="pre_temp">
    <div class="pre_temp_con" :class="isSmallViewport ? 'isSmallViewport' : ''">
      <div v-if="!isSmallViewport">
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script setup>
const logoUrl = import.meta.env.VITE_APP_LOGO;
const officialUrl = import.meta.env.VITE_APP_OFFICIAL_URL;
const icpRecordNumber = import.meta.env.VITE_APP_THE_ICP_RECORD_NUMBER;
function handleFilings() {
  window.open("https://beian.miit.gov.cn/#/Integrated/index", "_blank");
}

const isSmallViewport = ref(false);
function checkViewportSize() {
  isSmallViewport.value = window.innerWidth <= 768;
}

onMounted(() => {
  checkViewportSize();
  window.addEventListener("resize", checkViewportSize);
});
</script>

<style lang="less">
.pre_temp {
  height: 100vh;
  overflow: hidden;
 // background: #0b1320;
  background: url('../../assets/images/plan/login_bg.png') no-repeat;
  background-size: cover;
  background-position: center;
  .isSmallViewport {
    .right {
      width: 100% !important;

      .form {
        width: 80% !important;
      }
    }

    .steps {
      left: 20% !important;
    }
  }

  .pre_temp_con {
    display: flex;
    height: 100%;
    overflow: hidden;
    align-items: center;
    position: relative;

    .header_logo {
      position: absolute;
      top: 0;
      left: 24px;
      display: block;
      width: 165px;
      height: 64px;
    }

    .left {
      width: 57%;
      height: 100%;

      .bg_img {
        display: block;
        width: 100%;
        height: 100%;
      }
    }

    .right {
      width: 43%;
      height: 100%;
      display: flex;
      align-items: center;
      flex-flow: column;
      justify-content: center;

      .form {
        width: 450px;
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        margin: 0 auto;

        .top {
          display: flex;
          align-items: center;
          justify-content: space-between;

          .title {
            font-size: 24px;
            color: rgba(255, 255, 255, 0.85);
            cursor: pointer;

            &:hover {
              color: #fff;
            }
          }

          .right_icon {
            display: flex;
            align-items: center;

            .phone_icon,
            .scan_icon {
              cursor: pointer;
            }

            .phone_icon {
              width: 26px;
              height: 26px;
              display: block;
              margin-right: 20px;
            }

            .scan_icon {
              width: 26px;
              height: 26px;
              display: block;
            }
          }

          .return_login_text {
            font-size: 16px;
            font-weight: 400;
            color: rgba(0, 0, 0, 0.6);
            cursor: pointer;

            &:hover {
              color: #ffffff;
            }
          }
        }

        .item_view {
          margin-top: 100px;

          .item {
            .ok_border {
              border-bottom: 1px solid #2696ff !important;
            }

            .not_border {
              border-bottom: 1px solid #d63939 !important;
            }

            .input_view {
              position: relative;
              height: 38px;
              box-sizing: border-box;
              padding-bottom: 14px;
              display: flex;
              align-items: center;
              border-bottom: 1px solid rgba(255, 255, 255, 0.3);

              .eyes_icon {
                position: absolute;
                right: 0;
                bottom: 7px;
                display: block;
                width: 23px;
                height: 23px;
                cursor: pointer;
              }

              .input {
                flex: 1;

                .el-input__wrapper {
                  outline: none;
                  border: none;
                  background: transparent;
                  box-shadow: none;
                  padding: 0;
                }
              }

              .code_text {
                font-size: 16px;
                color: #2696ff;
                cursor: pointer;
              }

              .code_text:hover {
                color: #69b7ff;
              }
            }

            .tip {
              font-size: 12px;
              color: #d63939;
              padding-top: 10px;
              height: 20px;
            }
          }
        }

        .submit_btn {
          // width: 450px;
          color: rgba(255, 255, 255, 0.85) !important;
          width: 100%;
          min-height: 40px;
          line-height: 40px;
          background: #2156b3;
          border-radius: 6px;
          overflow: hidden;
          border: none;
          margin-top: 41px;
          margin-left: 0px;
        }

        .wxbtn {
          margin-top: 20px;
          width: 100%;
          min-height: 40px;
          border-radius: 6px;
          overflow: hidden;
          margin-left: 0px;
          line-height: 40px;
          border-radius: 6px 6px 6px 6px;
          background: #0b1320;
          color: rgba(255, 255, 255, 0.85);
          border: 1px solid rgba(255, 255, 255, 0.15);
        }

        .wxbtn:hover {
          border: 1px solid rgba(255, 255, 255, 0.3);
          color: #fff;
          background: #0b1320;
        }

        .operate {
          display: flex;
          align-items: center;
          justify-content: right;
          margin-top: 40px;

          .keep_login {
            display: flex;
            align-items: center;
            cursor: pointer;

            .text {
              font-size: 16px;
              color: rgba(255, 255, 255, 0.6);
              margin-left: 8px;

              &:hover {
                color: #fff;
              }
            }
          }

          .forget_pass {
            color: #04134A;
            cursor: pointer;
            font-size: 20px;

            &:hover {
              color: #fff;
            }
          }
        }

        

        .bottom_tip {
          color: #d63939;
          font-size: 16px;
          text-align: center;
          margin-top: 50px;
          min-height: 60px;
        }
      }

      .filings {
        margin-bottom: 30px;
        text-align: center;
        font-size: 12px;
        font-weight: 400;
        color: rgba(255, 255, 255, 0.2);
        display: flex;
        width: 100%;
        justify-content: center;
        cursor: pointer;

        .register_now_btn {
          cursor: pointer;
          color: #2696ff;

          &:hover {
            color: #69b7ff;
          }
        }
      }
    }

    .return_superior {
      display: flex;
      align-items: center;
      margin-top: 60px;
      justify-content: center;
      cursor: pointer;

      .return_icon {
        margin-right: 5px;
        display: block;
        height: 24px;
        width: 24px;
      }

      .text {
        color: rgba(255, 255, 255, 0.6);
        font-size: 16px;

        &:hover {
          color: rgba(255, 255, 255, 0.85);
        }
      }
    }

    .steps {
      position: absolute;
      bottom: 120px;
      // left: 290px;
      left: 33%;
      width: 260px;
      display: flex;
      align-items: center;
      justify-content: space-between;

      .steps_item {
        width: 80px;
        height: 2px;
        background: rgba(255, 255, 255, 0.15);
      }

      .steps_item_active {
        background: #2696ff;
      }
    }
  }
}
</style>
