import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { UserEntity } from './user.entity';
import { EntityName } from 'src/common/enums/entity-name.enum';

@Entity(EntityName.OTP)
export class OtpEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column()
  code: string;
  @Column({ type: 'timestamp' })
  expiresIn: Date;
  @ManyToOne(() => UserEntity, { onDelete: 'CASCADE' })
  user: UserEntity;
}