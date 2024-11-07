import { Entity, PrimaryGeneratedColumn, Column, OneToMany, OneToOne, JoinColumn } from 'typeorm';
import { BookEntity } from '../../book/entities/book.entity';
import { EntityName } from 'src/common/enums/entity-name.enum';
import { UserRole } from 'src/common/enums/role.enum';
import { UserEntity } from 'src/modules/user/entities/user.entity';

@Entity(EntityName.LIBRARY)
export class LibraryEntity {
  @PrimaryGeneratedColumn('uuid')
  libraryId: string;
  @Column()
  ownerFirstName: string;
  @Column()
  ownerLastName: string;
  @Column()
  phone: string;
  @Column()
  libraryName: string;
  @Column()
  location: string;
  @OneToMany(() => BookEntity, (book) => book.library)
  books: BookEntity[];
  @OneToOne(() => UserEntity, (user) => user.library, { cascade: true })
  @JoinColumn()
  owner: UserEntity;
}
