mkdir dist/.well-known

touch dist/.well-known/ic-domains
touch dist/.ic-assets.json

if [ "$MODE" == "staging" ]; then
  DOMAIN="beta.elna.ai"
else
  DOMAIN="dapp.elna.ai"
fi

echo "$DOMAIN" > dist/.well-known/ic-domains
echo "[
  {
    \"match\": \".well-known\",
    \"ignore\": false
  }
]" > dist/.ic-assets.json

echo "\n\n\n wellkown created. $DOMAIN\n\n\n"
