type TTypography = {
  tag: "div" | "h1" | "h2";
};

const Typography = ({ tag } : TTypography) => {
  const Component = tag;
  return <Component>Typography</Component>;
};

export default Typography;
