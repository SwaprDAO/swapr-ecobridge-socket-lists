import path from 'path'
import { v4 as uuidv4 } from 'uuid'
import { Folders, Token } from './types'
import { writeFile, mkdir, rm } from 'fs/promises'

const meta = {
  id: uuidv4(),
  creationTime: new Date().toISOString()
}

export const parseResponse = async <RetType = any, T extends Promise<Response> = Promise<any>>(
  responsePromise: T
): Promise<RetType> => {
  const response = await responsePromise
  const responseJson = await response.json()

  return responseJson
}

export const clearFolders = async () => {
  const debugFolder = path.resolve((path.dirname(require.main!.filename), Folders.DEBUG))
  const listsFolder = path.resolve((path.dirname(require.main!.filename), Folders.LISTS))

  await rm(debugFolder, { recursive: true, force: true })
  await rm(listsFolder, { recursive: true, force: true })
}

export const exportToJSON = async (name: string, data: object, folder: Folders = Folders.DEBUG) => {
  const resolvedFolder = path.resolve((path.dirname(require.main!.filename), folder))
  await mkdir(resolvedFolder, { recursive: true })

  const toExport = {
    ...meta,
    data
  }
  await writeFile(path.resolve(resolvedFolder, `${name}.json`), JSON.stringify(toExport, undefined, 2))
}

export const uniqueTokens = (listA: Token[], listB: Token[]) => {
  const cache = new Map()

  const uniqueTokens = [...listA, ...listB].reduce<Token[]>((total, token) => {
    if (!cache.has(token.address)) {
      total.push(token)
    }
    return total
  }, [])

  return uniqueTokens
}
