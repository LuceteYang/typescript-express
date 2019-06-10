import {
    AutoIncrement,
    BelongsToMany,
    Column,
    DefaultScope,
    Model,
    PrimaryKey,
    Scopes,
    Table,
    DataType
  } from "sequelize-typescript";
  
  @Table({
    tableName: 'user',
    timestamps: false,
    charset: 'utf8',
    collate: 'utf8_general_ci'
  })
  export class User extends Model<User> {
  
    @Column({
      allowNull: false,
      unique: true,
      type: 'BINARY(16)',
    })
    get uuid(): any {
      return Buffer.from(this.getDataValue('uuid')).toString('hex')
    }
  
    @Column({
      type: DataType.STRING,
      allowNull: false,
      unique: true,
    })
    email: string;
  
    @Column({
      type: DataType.STRING,
      allowNull: false,
    })
    password: string;
  
    @Column({
      type: DataType.STRING,
      allowNull: false,
    })
    nickname: string;
  }
  