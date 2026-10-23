import { AbsoluteFill, Composition, staticFile, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { Audio, Img, Video } from "@remotion/media";
import { useState, useEffect } from "react";

const BG_COLORS = {
  pink: "#FFE4E9",
  darkPink: "#FFB7C5",
  coral: "#FF8FA3",
  white: "#FFFFFF",
  text: "#4A4A4A",
  green: "#7DD3C0",
};

const Scene1 = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleOpacity = interpolate(frame, [0, 30], [0, 1], { extrapolateRight: "clamp" });
  const titleScale = interpolate(frame, [0, 30], [0.8, 1], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ background: BG_COLORS.pink }}>
      <div
        style={{
          position: "absolute",
          top: "35%",
          left: "50%",
          transform: `translate(-50%, -50%) scale(${titleScale})`,
          opacity: titleOpacity,
          textAlign: "center",
        }}
      >
        <div style={{ fontSize: 80, fontWeight: "bold", color: BG_COLORS.text }}>
          💰 财务管家
        </div>
        <div style={{ fontSize: 36, color: BG_COLORS.coral, marginTop: 20 }}>
          你的私人理财小助手
        </div>
      </div>
    </AbsoluteFill>
  );
};

const Scene2 = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const offset = 3 * fps;

  const opacity = interpolate(frame, [offset, offset + 30], [0, 1], { extrapolateRight: "clamp" });
  const y = interpolate(frame, [offset, offset + 30], [50, 0], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ background: BG_COLORS.white }}>
      <div style={{ position: "absolute", top: "25%", left: "50%", transform: `translateX(-50%)`, opacity, textAlign: "center" }}>
        <div style={{ fontSize: 48, color: BG_COLORS.text, fontWeight: "bold" }}>
          你是不是也有这种感觉？
        </div>
        <div style={{ fontSize: 36, color: BG_COLORS.coral, marginTop: 30 }}>
          💸 工资刚到账就没了
        </div>
        <div style={{ fontSize: 36, color: BG_COLORS.coral, marginTop: 15 }}>
          🤔 钱不知道花哪儿了
        </div>
        <div style={{ fontSize: 36, color: BG_COLORS.coral, marginTop: 15 }}>
          😰 想省钱但无从下手
        </div>
      </div>
    </AbsoluteFill>
  );
};

const Scene3 = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const offset = 6 * fps;

  const opacity = interpolate(frame, [offset, offset + 30], [0, 1], { extrapolateRight: "clamp" });
  const scale = interpolate(frame, [offset, offset + 30], [0.5, 1], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ background: BG_COLORS.darkPink }}>
      <div
        style={{
          position: "absolute",
          top: "30%",
          left: "50%",
          transform: `translate(-50%, -50%) scale(${scale})`,
          opacity,
          textAlign: "center",
        }}
      >
        <div style={{ fontSize: 32, color: BG_COLORS.text }}>
          现在起，3秒改变！
        </div>
        <div style={{ fontSize: 72, fontWeight: "bold", color: BG_COLORS.white, marginTop: 20 }}>
          ⚡ 3秒快速记账
        </div>
        <div style={{ fontSize: 28, color: BG_COLORS.white, marginTop: 20, opacity: 0.9 }}>
          选择分类 → 输入金额 → 完成！
        </div>
      </div>
    </AbsoluteFill>
  );
};

const Scene4 = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const offset = 9 * fps;

  const opacity = interpolate(frame, [offset, offset + 30], [0, 1], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ background: BG_COLORS.white }}>
      <div style={{ position: "absolute", top: "20%", left: "50%", transform: "translateX(-50%)", opacity, textAlign: "center" }}>
        <div style={{ fontSize: 44, fontWeight: "bold", color: BG_COLORS.text }}>
          收入支出，一目了然
        </div>
        <div style={{ fontSize: 36, color: BG_COLORS.green, marginTop: 30 }}>
          📊 分类统计
        </div>
        <div style={{ fontSize: 36, color: BG_COLORS.coral, marginTop: 20 }}>
          📈 月度趋势
        </div>
        <div style={{ fontSize: 36, color: "#8E8E8E", marginTop: 20 }}>
          📥 Excel导出
        </div>
      </div>
    </AbsoluteFill>
  );
};

const Scene5 = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const offset = 12 * fps;

  const opacity = interpolate(frame, [offset, offset + 30], [0, 1], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ background: BG_COLORS.pink }}>
      <div
        style={{
          position: "absolute",
          top: "35%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          opacity,
          textAlign: "center",
        }}
      >
        <div style={{ fontSize: 60, fontWeight: "bold", color: BG_COLORS.text }}>
          💕 粉色UI 超好看
        </div>
        <div style={{ fontSize: 32, color: BG_COLORS.text, marginTop: 30 }}>
          用着心情好，才能坚持记账！
        </div>
      </div>
    </AbsoluteFill>
  );
};

const Scene6 = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const offset = 15 * fps;

  const opacity = interpolate(frame, [offset, offset + 30], [0, 1], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ background: BG_COLORS.darkPink }}>
      <div
        style={{
          position: "absolute",
          top: "35%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          opacity,
          textAlign: "center",
        }}
      >
        <div style={{ fontSize: 48, fontWeight: "bold", color: BG_COLORS.white }}>
          越早开始，越早受益！
        </div>
        <div style={{ fontSize: 36, color: BG_COLORS.white, marginTop: 30 }}>
          3秒改变，月底惊喜
        </div>
        <div style={{ fontSize: 48, fontWeight: "bold", color: BG_COLORS.white, marginTop: 60 }}>
          💰 财务管家
        </div>
      </div>
    </AbsoluteFill>
  );
};

const FinancePromo = () => {
  return (
    <div style={{ width: "100%", height: "100%" }}>
      {/* 所有场景 */}
      <Scene1 />
      <Scene2 />
      <Scene3 />
      <Scene4 />
      <Scene5 />
      <Scene6 />

      {/* 配音 */}
      <Audio src={staticFile("voiceover.m4a")} volume={1} />
    </div>
  );
};

export const RemotionRoot = () => {
  return (
    <Composition
      id="FinancePromo"
      component={FinancePromo}
      durationInFrames={540} // ~18秒 @ 30fps (匹配配音长度约18秒)
      fps={30}
      width={1080}
      height={1920} // 9:16 比例
    />
  );
};