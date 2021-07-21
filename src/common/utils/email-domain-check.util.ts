export function mailDomainIs(email: string, domain: string) {
  const mail = email.split('@').pop();

  return mail === domain;
}
