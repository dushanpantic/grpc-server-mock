export default function get(data: any, path: string): any {
  if (!path) {
    return data;
  }
  
  return path
    .split('.')
    .reduce((acc, curr) => acc && acc[curr], data)
}
