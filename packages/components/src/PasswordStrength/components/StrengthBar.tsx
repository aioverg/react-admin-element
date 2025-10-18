interface Props {
  strength: number;
}

const arr = new Array(5).fill(0).map((_, index) => index + 1);

function StrengthBar(props: Props) {
  const { strength } = props;

  return (
    <div style={{ display: "flex", alignItems: "center" }}>
      {arr.map((item) => (
        <div
          key={item}
          style={{
            width: "19%",
            height: "5px",
            margin: "5px 1px 0 0",
            backgroundColor:
              item <= strength && strength > 3
                ? "blue"
                : item <= strength && strength === 3
                  ? "yellow"
                  : item <= strength && strength < 3
                    ? "red"
                    : "#dde1e3",
          }}
        ></div>
      ))}
    </div>
  );
}

export default StrengthBar;
