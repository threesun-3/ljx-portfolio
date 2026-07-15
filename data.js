/*
 * 网站内容统一在这里维护。
 * 证书原图来自个人资料目录，已转换为适合网页加载的 WebP 文件。
 * 发布前请确认邮箱、简历 PDF 和证书公开范围符合你的隐私预期。
 */
window.PORTFOLIO_DATA = {
  profile: {
    name: "卢嘉贤",
    role: "嵌入式软件工程师",
    summary:
      "人工智能专业本科，专注单片机与嵌入式软件开发。具备 STM32、FreeRTOS、RS485/Modbus、外设驱动和软硬件联调经验，做过智能称重设备、智能物流搬运车与智能门锁项目。",
    location: "厦门",
    education: "本科 · 人工智能",
    email: "1593105984@qq.com",
    resume: "assets/resume.pdf",
    stats: [
      { value: "12", label: "代表证书" },
      { value: "2段", label: "行业经历" },
      { value: "2项", label: "核心项目" },
    ],
  },

  skills: [
    {
      icon: "MCU",
      title: "单片机开发",
      description: "熟悉 C/C++、STM32F103/F407、STC51/STC15、TI MSPM0G3507 与 N32G430，具备多平台项目开发和调试经验。",
    },
    {
      icon: "RTOS",
      title: "实时系统",
      description: "掌握 FreeRTOS 任务调度、队列、信号量、互斥锁、软件定时器和任务间通信，能够设计状态机驱动的控制流程。",
    },
    {
      icon: "BUS",
      title: "通信与外设",
      description: "熟悉 UART、RS485、Modbus RTU、I²C、SPI、CAN、ADC、PWM、编码器、电机驱动和蓝牙通信。",
    },
    {
      icon: "PCB",
      title: "软硬件联调",
      description: "能够阅读原理图、参与 PCB 绘制与板卡焊接，使用示波器、逻辑分析仪和万用表定位常见硬件问题。",
    },
    {
      icon: "GUI",
      title: "界面与网络",
      description: "使用 LVGL、GUI Guider 和 Qt 开发交互界面，了解 TCP/IP、HTTP、MQTT、Socket、多线程和数据库连接。",
    },
    {
      icon: "DEV",
      title: "工程与调试",
      description: "熟悉 Keil MDK、STM32CubeMX、Git、Makefile、Altium Designer、嘉立创 EDA，并习惯记录调试问题与版本变更。",
    },
  ],

  experiences: [
    {
      date: "2022.09 — 2026.06",
      title: "人工智能专业本科",
      subtitle: "泉州信息工程学院",
      description: "担任学习委员和电子创新社社长，组织单片机、嵌入式开发及电子设计竞赛训练；获得国家奖学金并被评为优秀毕业生。",
    },
    {
      date: "2025.04 — 2025.08",
      title: "STM32F407 智能物流搬运车",
      subtitle: "中国大学生工程实践与创新能力大赛 · 国家一等奖",
      description: "负责摄像头与底盘运动协调控制、OpenMV 视觉参数调试和整车联调，实现色块识别、机械抓取与定点投放。",
    },
    {
      date: "2025.09 — 2026.02",
      title: "电子工程师助理",
      subtitle: "浙江雄茂电子科技有限公司",
      description: "参与 BF5885 智能门锁外设驱动、指纹识别与电磁锁控制，完成原理图、PCB、焊接、上电测试和软硬件故障排查。",
    },
    {
      date: "2026.02 — 2026.06",
      title: "单片机工程师",
      subtitle: "泉州市天志智能科技有限公司",
      description: "负责智能茶叶定量下料控制器开发，完成称重采集、RS485/Modbus、执行器控制、参数管理及整机软硬件联调。",
    },
  ],

  certificates: [
    {
      title: "中国大学生工程实践与创新能力大赛国家一等奖",
      category: "国家级竞赛",
      issuer: "中国大学生工程实践与创新能力大赛",
      date: "2025.06",
      image: "assets/certificates/engineering-practice-2025-national-first.webp",
      description: "智能物流搬运赛项国家一等奖。项目基于 STM32F407、FreeRTOS 与 OpenMV，实现视觉识别、机械抓取和定点搬运。",
    },
    {
      title: "中国机器人大赛暨 RoboCup 中国赛国家一等奖",
      category: "国家级竞赛",
      issuer: "中国机器人大赛暨 RoboCup 中国赛",
      date: "2025",
      image: "assets/certificates/robocup-2025-national-first.webp",
      description: "创新创意赛“机器人+”创新总决赛一等奖，体现机器人系统设计、控制与团队协作能力。",
    },
    {
      title: "睿抗机器人开发者大赛全国一等奖",
      category: "国家级竞赛",
      issuer: "睿抗机器人开发者大赛组委会",
      date: "2024",
      image: "assets/certificates/ruichuang-2024-national-first.webp",
      description: "睿抗机器人开发者大赛全国总决赛一等奖，围绕机器人软硬件系统完成设计、调试和现场竞赛。",
    },
    {
      title: "第十五届蓝桥杯全国总决赛二等奖",
      category: "国家级竞赛",
      issuer: "蓝桥杯全国软件和信息技术专业人才大赛",
      date: "2024",
      image: "assets/certificates/lanqiao-2024-national-second.webp",
      description: "蓝桥杯嵌入式方向全国总决赛二等奖，重点考察单片机编程、外设控制和综合应用能力。",
    },
    {
      title: "全球校园人工智能算法精英大赛全国三等奖",
      category: "国家级竞赛",
      issuer: "全球校园人工智能算法精英大赛",
      date: "2024",
      image: "assets/certificates/ai-algorithm-2024-national-third.webp",
      description: "第六届全球校园人工智能算法精英大赛全国总决赛三等奖。",
    },
    {
      title: "TI 杯全国大学生电子设计竞赛福建赛区一等奖",
      category: "省级竞赛",
      issuer: "全国大学生电子设计竞赛福建赛区",
      date: "2024",
      image: "assets/certificates/ti-2024-first.webp",
      description: "2024 年 TI 杯全国大学生电子设计竞赛福建赛区本科组一等奖，参与方案设计、嵌入式程序与系统联调。",
    },
    {
      title: "创芯中国集成电路创新挑战赛华东赛区一等奖",
      category: "区域竞赛",
      issuer: "创芯中国集成电路创新挑战赛",
      date: "2023",
      image: "assets/certificates/ic-innovation-2023-east-first.webp",
      description: "集成电路测试应用技术技能赛道华东赛区一等奖。",
    },
    {
      title: "国家奖学金荣誉证书",
      category: "荣誉奖学金",
      issuer: "中华人民共和国教育部",
      date: "2025.12",
      image: "assets/certificates/national-scholarship.webp",
      description: "获得 2024—2025 学年本专科生国家奖学金。",
    },
    {
      title: "国家励志奖学金",
      category: "荣誉奖学金",
      issuer: "泉州信息工程学院",
      date: "2024.11",
      image: "assets/certificates/national-inspirational-scholarship-2024.webp",
      description: "获得 2023—2024 学年国家励志奖学金。",
    },
    {
      title: "校级一等奖学金",
      category: "荣誉奖学金",
      issuer: "泉州信息工程学院",
      date: "2024.12",
      image: "assets/certificates/university-first-scholarship.webp",
      description: "获得泉州信息工程学院 2023—2024 学年一等奖学金。",
    },
    {
      title: "三好学生荣誉证书",
      category: "荣誉表彰",
      issuer: "泉州信息工程学院",
      date: "2024.11",
      image: "assets/certificates/excellent-student-2024.webp",
      description: "获评泉州信息工程学院 2023—2024 学年“三好学生”。",
    },
    {
      title: "ROS 机器人操作系统培训结业证书",
      category: "培训认证",
      issuer: "南京 ROS 机器人操作系统培训",
      date: "2024.01",
      image: "assets/certificates/ros-training-2024.webp",
      description: "完成机器人操作系统 ROS 理论与实践技能培训课程。",
    },
  ],
};
