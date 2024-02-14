mkdir dist/.well-known

touch dist/.well-known/ic-domains
touch dist/.ic-assets.json

echo "dapp.elna.ai" > dist/.well-known/ic-domains
echo "[
  {
    \"match\": \".well-known\",
    \"ignore\": false
  }
]" > dist/.ic-assets.json
