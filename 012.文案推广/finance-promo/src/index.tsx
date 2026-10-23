import { registerRoot } from "@remotion/cli";
import { createRoot } from "react-dom/client";

// 导入我们的组件
import { RemotionRoot } from "./src/Root";

// 注册根组件
registerRoot(() => {
  const root = document.getElementById("root");
  if (!root) throw new Error("Root element not found");
  const root2 = createRoot(root);
  root2.render(<RemotionRoot />);
});