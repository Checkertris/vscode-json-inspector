
export default interface SchemaData<T, C> {
    data: T
    schema: any //fb.ObjectField<T, any, C, false>
}

export type SchemaReference = {
    name: string
    path: string
}

export type ConfigViewMessage =
    | {
          type: "has-workspace"
          data: boolean
      }
    | {
          type: "path-change"
          data?: string
      }
    | {
          type: "folder-change"
          data: {
              refFolder: boolean
              schemaFolder: boolean
              outputFolder: boolean
              schemas: SchemaReference[]
          }
      }

export type ConfigAppMessage = {
    type: "new-form"
    data: SchemaReference
}

export type EditorViewMessage =
    | {
          type: "new-form-callback"
          data: any //fb.ObjectField<any, any, any, any>
      }
    | {
          type: "old-form-callback"
          data: SchemaData<any, any>
      }
