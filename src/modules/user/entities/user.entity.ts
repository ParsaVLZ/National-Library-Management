import { Entity, PrimaryGeneratedColumn, Column, OneToMany, OneToOne } from 'typeorm';
import { EntityName } from 'src/common/enums/entity-name.enum';
import { UserRole } from 'src/common/enums/role.enum';
import { OrderEntity } from 'src/modules/order/entities/order.entity';
import { LibraryEntity } from 'src/modules/library/entities/library.entity';

@Entity(EntityName.USER)
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column()
  first_name: string;
  @Column()
  last_name: string;
  @Column({ unique: true })
  mobile: string;
  @Column({ type: 'enum', enum: UserRole })
  role: UserRole;
  @Column({ default: true })
  firstPurchase: boolean;
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;
  @OneToMany(() => OrderEntity, (order) => order.user)
  orders: OrderEntity[];
  @OneToOne(() => LibraryEntity, (library) => library.owner)
  library: LibraryEntity;
}
