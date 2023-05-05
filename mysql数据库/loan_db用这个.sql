/*
 Navicat Premium Data Transfer

 Source Server         : mysql5.6
 Source Server Type    : MySQL
 Source Server Version : 50620
 Source Host           : localhost:3306
 Source Schema         : loan_db

 Target Server Type    : MySQL
 Target Server Version : 50620
 File Encoding         : 65001

 Date: 04/02/2021 19:03:31
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for t_admin
-- ----------------------------
DROP TABLE IF EXISTS `t_admin`;
CREATE TABLE `t_admin`  (
  `username` varchar(20) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT '',
  `password` varchar(32) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  PRIMARY KEY (`username`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Compact;

-- ----------------------------
-- Records of t_admin
-- ----------------------------
INSERT INTO `t_admin` VALUES ('a', 'a');

-- ----------------------------
-- Table structure for t_employee
-- ----------------------------
DROP TABLE IF EXISTS `t_employee`;
CREATE TABLE `t_employee`  (
  `employeeNo` varchar(30) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT 'employeeNo',
  `password` varchar(30) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '登录密码',
  `name` varchar(20) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '员工姓名',
  `gender` varchar(4) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '性别',
  `inDate` varchar(20) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '入职日期',
  `empPhoto` varchar(60) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '员工照片',
  `telephone` varchar(20) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '联系电话',
  `email` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '邮箱',
  `address` varchar(80) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '家庭地址',
  PRIMARY KEY (`employeeNo`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Compact;

-- ----------------------------
-- Records of t_employee
-- ----------------------------
INSERT INTO `t_employee` VALUES ('YG001', '123', '李晓天', '男', '2020-09-29', 'img/15.jpg', '1', '2', '3');
INSERT INTO `t_employee` VALUES ('YG002', '123', '张涛', '男', '2020-10-07', 'img/14.jpg', '13090813942', 'zhangtao@126.com', '四川达州啊啊');

-- ----------------------------
-- Table structure for t_loanapply
-- ----------------------------
DROP TABLE IF EXISTS `t_loanapply`;
CREATE TABLE `t_loanapply`  (
  `applyId` int(11) NOT NULL AUTO_INCREMENT COMMENT '申请编号',
  `reason` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '贷款原因',
  `loadMoney` float NOT NULL COMMENT '贷款金额',
  `loanType` varchar(20) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '贷款种类',
  `loanTerm` varchar(20) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '贷款期限',
  `userObj` varchar(30) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '申请的客户',
  `shenHeState` varchar(20) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '审核状态',
  `shenHeTime` varchar(20) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '审核时间',
  `shenHeRen` varchar(20) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '审核人',
  PRIMARY KEY (`applyId`) USING BTREE,
  INDEX `userObj`(`userObj`) USING BTREE,
  CONSTRAINT `t_loanapply_ibfk_1` FOREIGN KEY (`userObj`) REFERENCES `t_userinfo` (`user_name`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 4 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Compact;

-- ----------------------------
-- Records of t_loanapply
-- ----------------------------
INSERT INTO `t_loanapply` VALUES (1, '做生意缺少资金', 2000, '生意贷款', '5年', 'KH001', '审核通过', '2020-10-03 21:24:19', 'YG001');
INSERT INTO `t_loanapply` VALUES (2, '上学需要资金', 5000, '自营贷款', '5年', 'KH002', '审核通过', '2020-10-03 16:27:31', 'YG001');
INSERT INTO `t_loanapply` VALUES (3, '儿子上大学的学费', 20000, '其他贷款', '2年', 'KH001', '审核通过', '2021-02-04 18:10:46', 'YG001');

-- ----------------------------
-- Table structure for t_notice
-- ----------------------------
DROP TABLE IF EXISTS `t_notice`;
CREATE TABLE `t_notice`  (
  `noticeId` int(11) NOT NULL AUTO_INCREMENT COMMENT '公告id',
  `title` varchar(80) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '标题',
  `content` varchar(5000) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '公告内容',
  `publishDate` varchar(20) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '发布时间',
  PRIMARY KEY (`noticeId`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 2 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Compact;

-- ----------------------------
-- Records of t_notice
-- ----------------------------
INSERT INTO `t_notice` VALUES (1, '银行信贷系统成立了！', '<p>信用越高，能贷款的金额越高哦！</p>', '2020-09-29 17:41:12');

-- ----------------------------
-- Table structure for t_payback
-- ----------------------------
DROP TABLE IF EXISTS `t_payback`;
CREATE TABLE `t_payback`  (
  `paybackId` int(11) NOT NULL AUTO_INCREMENT COMMENT '还款编号',
  `loanObj` int(11) NOT NULL COMMENT '贷款信息',
  `payMoney` float NOT NULL COMMENT '还款金额',
  `payWay` varchar(20) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '还款方式',
  `payAccount` varchar(20) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '还款账号',
  `payTime` varchar(20) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '还款时间',
  `userObj` varchar(30) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '还款人',
  `xyjf` float NOT NULL COMMENT '信用积分',
  `shenHeState` varchar(20) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '审核状态',
  `shenHeRen` varchar(20) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '审核人',
  `shenHeTime` varchar(20) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '审核时间',
  PRIMARY KEY (`paybackId`) USING BTREE,
  INDEX `loanObj`(`loanObj`) USING BTREE,
  INDEX `userObj`(`userObj`) USING BTREE,
  CONSTRAINT `t_payback_ibfk_1` FOREIGN KEY (`loanObj`) REFERENCES `t_loanapply` (`applyId`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `t_payback_ibfk_2` FOREIGN KEY (`userObj`) REFERENCES `t_userinfo` (`user_name`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 5 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Compact;

-- ----------------------------
-- Records of t_payback
-- ----------------------------
INSERT INTO `t_payback` VALUES (1, 1, 1000, '银行卡', '6220102242349872489', '2020-09-29 17:40:04', 'KH001', 1, '审核通过', 'YG001', '2020-09-29 17:40:53');
INSERT INTO `t_payback` VALUES (2, 1, 1000, '银行卡', '6223100834234234932', '2020-10-03 16:35:14', 'KH001', 1, '审核通过', 'a', '2020-10-03 21:42:24');
INSERT INTO `t_payback` VALUES (3, 2, 1000, '银行卡', '6223100834234234932', '2020-10-03 16:36:54', 'KH002', 1, '审核通过', 'YG001', '2020-10-03 21:36:17');
INSERT INTO `t_payback` VALUES (4, 3, 800, '银行卡', '6223100834234234932', '2021-02-04 18:11:52', 'KH001', 0.8, '待审核', '--', '--');

-- ----------------------------
-- Table structure for t_userinfo
-- ----------------------------
DROP TABLE IF EXISTS `t_userinfo`;
CREATE TABLE `t_userinfo`  (
  `user_name` varchar(30) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT 'user_name',
  `password` varchar(30) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '登录密码',
  `name` varchar(20) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '客户名称',
  `xydj` varchar(20) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '信用等级',
  `userPhoto` varchar(60) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '客户照片',
  `telephone` varchar(20) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '联系电话',
  `email` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '联系邮箱',
  `address` varchar(80) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '客户地址',
  `yhjf` float NOT NULL COMMENT '用户积分',
  `regTime` varchar(20) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '注册时间',
  PRIMARY KEY (`user_name`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Compact;

-- ----------------------------
-- Records of t_userinfo
-- ----------------------------
INSERT INTO `t_userinfo` VALUES ('KH001', '123', '王晓婷', '一星级', 'img/2.jpg', '13058010342', 'wangxiaot@163.com', '四川南充市', 13, '2020-09-29 17:36:37');
INSERT INTO `t_userinfo` VALUES ('KH002', '123', '李航', '一星级', 'img/8.jpg', '13503084234', 'lihang@126.com', '四川成都红星路', 6, '2020-10-03 15:10:43');

-- ----------------------------
-- Table structure for t_ziliao
-- ----------------------------
DROP TABLE IF EXISTS `t_ziliao`;
CREATE TABLE `t_ziliao`  (
  `ziliaoId` int(11) NOT NULL AUTO_INCREMENT COMMENT '资料编号',
  `ziliaoName` varchar(20) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '资料名称',
  `ziliaoFile` varchar(60) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '资料文件',
  `userObj` varchar(30) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '上传客户',
  `upTime` varchar(20) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '上传时间',
  `shenHeState` varchar(20) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '审核状态',
  `shenHeRen` varchar(20) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '审核人',
  `shenHeTime` varchar(20) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '审核时间',
  `xyjf` float NOT NULL COMMENT '信用积分',
  PRIMARY KEY (`ziliaoId`) USING BTREE,
  INDEX `userObj`(`userObj`) USING BTREE,
  CONSTRAINT `t_ziliao_ibfk_1` FOREIGN KEY (`userObj`) REFERENCES `t_userinfo` (`user_name`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 4 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Compact;

-- ----------------------------
-- Records of t_ziliao
-- ----------------------------
INSERT INTO `t_ziliao` VALUES (1, '房产证', 'file/fangchan.jpg', 'KH001', '2020-10-01 12:28:53', '审核通过', 'YG001', '2020-10-03 15:28:58', 10);
INSERT INTO `t_ziliao` VALUES (2, '本科学历证', 'file/xueli.jpg', 'KH002', '2020-10-03 15:54:24', '审核通过', 'YG001', '2020-10-03 21:14:32', 5);
INSERT INTO `t_ziliao` VALUES (3, '我的驾驶证', 'file/jiashi.jpg', 'KH001', '2021-02-04 18:04:40', '审核通过', 'YG001', '2021-02-04 18:09:48', 2);

SET FOREIGN_KEY_CHECKS = 1;
