import { IsBoolean, IsNotEmpty, IsNumber } from 'class-validator';

export class UpdateSensorMeasurementsDto {
  @IsNumber()
  humidity?: number;

  @IsNumber()
  temperature?: number;

  @IsNumber()
  waterLevel?: number;

  @IsNumber()
  dust?: number;
}

export class UpdateActionDto {
  @IsBoolean()
  securityMode?: boolean;

  @IsBoolean()
  windowOpen?: boolean;

  @IsBoolean()
  fanOn?: boolean;

  @IsBoolean()
  lightOn?: boolean;
}
