// https://medium.com/@theAngularGuy/how-to-create-an-interactive-donut-chart-using-svg-107cbf0b5b6

export interface DonutSlice {
  id: number;
  percent: number;
  color?: string;
  label?: string;
  onClickCb?: () => void;
}

interface DonutSliceWithCommands extends DonutSlice {
  offset: number;
  commands: string;
}

export function getSlicesWithCommandsAndOffsets(
  donutSlices: DonutSlice[],
  radius: number,
  svgSize: number,
  borderSize: number
): DonutSliceWithCommands[] {
  let previousPercent = 0;
  return donutSlices.map((slice) => {
    const sliceWithCommands: DonutSliceWithCommands = {
      ...slice,
      commands: getSliceCommands(slice, radius, svgSize, borderSize),
      offset: previousPercent * 3.6 * -1,
    };
    previousPercent += slice.percent;
    return sliceWithCommands;
  });
}

export function getSliceCommands(
  donutSlice: DonutSlice,
  radius: number,
  svgSize: number,
  borderSize: number,
  startDegrees: number = 0
): string {
  const degrees = percentToDegrees(donutSlice.percent);
  const longPathFlag = degrees > 180 ? 1 : 0;
  const innerRadius = radius - borderSize;

  const commands: string[] = [];
  // commands.push(`M ${svgSize / 2 + radius} ${svgSize / 2}`);
  commands.push(`M ${getCoordFromDegrees(startDegrees, radius, svgSize)}`);
  commands.push(
    `A ${radius} ${radius} 0 ${longPathFlag} 0 ${getCoordFromDegrees(
      degrees + startDegrees,
      radius,
      svgSize
    )}`
  );
  commands.push(
    `L ${getCoordFromDegrees(degrees + startDegrees, innerRadius, svgSize)}`
  );
  commands.push(
    `A ${innerRadius} ${innerRadius} 0 ${longPathFlag} 1 ${getCoordFromDegrees(
      startDegrees,
      radius - borderSize,
      svgSize
    )}`
  );
  return commands.join(' ');
}

export function getCoordFromDegrees(
  angle: number,
  radius: number,
  svgSize: number
): string {
  const x = Math.cos((angle * Math.PI) / 180);
  const y = Math.sin((angle * Math.PI) / 180);
  const coordX = x * radius + svgSize / 2;
  const coordY = y * -radius + svgSize / 2;
  return [coordX, coordY].join(' ');
}

export function percentToDegrees(percent: number): number {
  return percent * 3.6;
}
